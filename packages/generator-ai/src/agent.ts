import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import type { LanguageModelV1 } from '@ai-sdk/provider';
import { CoreMessage, generateText } from 'ai';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';

export interface Agent {
  generateFiles: (systemPrompt: string, messageHistory: CoreMessage[]) => Promise<void>;
}

export interface AgentConfig {
  apiKey: string;
  providerName: string;
  modelName: string;
  maxTokens: number;
  temperature: number;
}

/**
 * Creates an agent that can generate files.
 * @param baseFolder The base folder to generate the files in.
 * @param config The configuration for the agent.
 * @returns An agent that can generate files.
 */
export function createAgent(baseFolder: string, config: AgentConfig): Agent {
  const { providerName, modelName, apiKey, maxTokens, temperature } = config;
  const model = createLanguageModel(apiKey, providerName, modelName);
  console.log(`\n🔌 Using ${providerName} model ${modelName} with temperature ${temperature} and max tokens ${maxTokens}`);
  return {
    generateFiles: async (system: string, messages: CoreMessage[]) => {
      const projectDir = baseFolder;

      console.log(`\n🤖 Running agent with ${messages.length} messages in history`);

      const generationPromise = generateText({
        model,
        system,
        messages,
        maxTokens,
        temperature,
        maxSteps: 1000,
        tools: createTools(projectDir),
        toolChoice: 'auto'
      });
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Generation timed out after 10 minutes')), 10 * 60 * 1000);
      });

      const result = await Promise.race([generationPromise, timeoutPromise]);

      console.log('🤖 Agent finished successfully. Token usage:', {
        promptTokens: result.usage?.promptTokens,
        completionTokens: result.usage?.completionTokens,
        totalTokens: result.usage?.totalTokens,
        maxCompletionTokens: maxTokens,
        modelName
      });
    }
  }
}

function createLanguageModel(apiKey: string, providerName: string, modelName: string): LanguageModelV1 {
  switch (providerName) {
    case 'openai':
      return createOpenAI({ apiKey }).languageModel(modelName);
    case 'anthropic':
      return createAnthropic({ apiKey }).languageModel(modelName);
    default:
      throw new Error(`Unknown provider: ${providerName}`);
  }
}

function createTools(projectDir: string) {
  return {
    planProject: {
      description: 'Plan the project structure with a list of files and their descriptions',
      parameters: z.object({
        projectName: z.string().describe('Name of the project'),
        files: z.array(z.object({
          path: z.string().describe('File path relative to project root'),
          description: z.string().describe('Description of what this file contains')
        })).describe('List of files to create')
      }),
      execute: async ({ projectName, files }: { projectName: string; files: Array<{ path: string; description: string }> }) => {
        return executePlanProject(projectDir, projectName, files);
      }
    },
    writeFile: {
      description: 'Write content to a specific file',
      parameters: z.object({
        path: z.string().describe('File path to write to'),
        content: z.string().describe('Content to write to the file')
      }),
      execute: async ({ path: filePath, content }: { path: string; content: string }) => {
        return executeWriteFile(projectDir, filePath, content);
      }
    }
  };
}

async function executePlanProject(
  projectDir: string,
  projectName: string,
  files: Array<{ path: string; description: string }>
): Promise<string> {
  console.log(`\n📋 Stage 1: Planning project: ${projectName}`);
  console.log(`📁 Files to create: ${files.length}`);
  
  files.forEach((file: { path: string; description: string }) => {
    console.log(`   - ${file.path}: ${file.description}`);
  });
  
  // Create project directory
  await fs.promises.mkdir(projectDir, { recursive: true });

  console.log(`\n✨ Stage 2: Generating files for project: ${projectName}`);
  
  return `Project "${projectName}" planned with ${files.length} files. Ready to generate content.`;
}

async function executeWriteFile(
  projectDir: string,
  filePath: string,
  content: string
): Promise<string> {
  const fullPath = path.join(projectDir, filePath);
  
  // Create directory if it doesn't exist
  await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
  
  // Write file
  await fs.promises.writeFile(fullPath, content, 'utf-8');
  
  console.log(`   ✓ Created: ${filePath}`);
  return `File ${filePath} written successfully (${content.length} characters)`;
}
