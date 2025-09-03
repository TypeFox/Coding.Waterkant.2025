import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOllama } from 'ollama-ai-provider-v2';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModelV2 } from '@ai-sdk/provider';
import { ModelMessage, ToolSet, generateText } from 'ai';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';

export interface Agent {
  generateFiles: (systemPrompt: string, messageHistory: ModelMessage[]) => Promise<void>;
}

export interface AgentConfig {
  apiKey: string | undefined;
  baseURL: string | undefined;
  providerName: string;
  modelName: string;
  maxOutputTokens: number;
  temperature: number;
  debug: boolean;
}

/**
 * Creates an agent that can generate files.
 * @param baseFolder The base folder to generate the files in.
 * @param config The configuration for the agent.
 * @returns An agent that can generate files.
 */
export function createAgent(baseFolder: string, config: AgentConfig): Agent {
  const { providerName, modelName, apiKey, baseURL, maxOutputTokens, temperature, debug } = config;
  const model = createLanguageModel(apiKey, baseURL, providerName, modelName);

  console.log(`\n🔌 Using ${providerName} model ${modelName}${baseURL ? ` (${baseURL})` : ''} with temperature ${temperature} and max tokens ${maxOutputTokens}`);

  return {
    generateFiles: async (system: string, messages: ModelMessage[]) => {
      const projectDir = baseFolder;

      console.log(`\n🤖 Running agent with ${messages.length} messages in history`);

      const result = await generateText({
        model,
        system,
        messages,
        maxOutputTokens,
        temperature,
        stopWhen: (step) => step.steps.length > 1000,
        tools: createTools(projectDir),
        toolChoice: 'auto',
        onStepFinish: (step) => {
          if (debug) {
            console.log(`🤖 Step: ${JSON.stringify(step, null, 2)}`);
          }
        }
      });

      console.log('🤖 Agent finished successfully. Token usage:', {
        changedInputTokens: result.usage?.cachedInputTokens,
        inputTokens: result.usage?.inputTokens,
        outputTokens: result.usage?.outputTokens,
        reasoningTokens: result.usage?.reasoningTokens,
        totalTokens: result.usage?.totalTokens,
        maxOutputTokens: maxOutputTokens,
        modelName
      });
    }
  }
}

function createLanguageModel(apiKey: string | undefined, baseURL: string | undefined, providerName: string, modelName: string): LanguageModelV2 {
  switch (providerName) {
    case 'anthropic':
      return createAnthropic({ apiKey }).languageModel(modelName);
    case 'google':
      return createGoogleGenerativeAI({ apiKey }).languageModel(modelName);
    case 'ollama':
      return createOllama({ baseURL }).languageModel(modelName);
    case 'openai':
      return createOpenAI({ apiKey }).languageModel(modelName);
    default:
      throw new Error(`Unknown provider: ${providerName}`);
  }
}

function createTools(projectDir: string): ToolSet {
  return {
    writeFile: {
      description: 'Write content to a specific file',
      inputSchema: z.object({
        path: z.string().describe('File path to write to'),
        content: z.string().describe('Content to write to the file')
      }),
      execute: async ({ path: filePath, content }: { path: string; content: string }) => {
        return executeWriteFile(projectDir, filePath, content);
      }
    }
  };
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
