import { CoreMessage } from "ai";
import { Agent } from './agent.js';
import frontentPromptTemplate from './prompt-templates/frontend-prompt-template.md';
import backendPromptTemplate from "./prompt-templates/backend-prompt-template.md";
import { substituteVariables } from './prompt-templates/template-engine.js';
import path from 'path';
import fs from 'fs';

/**
 * Generates the backend and frontend code for a web application.
 * @param agent The agent to use to generate the code.
 * @param webAppModel The web app model to use to generate the code.
 * @param destination The destination folder to generate the code in.
 */
export async function generate(agent: Agent, webAppModel: string, destination: string): Promise<void> {

  { // generate backend
    const systemPrompt = substituteVariables(backendPromptTemplate, {
      // no variables, yet
    });
    const messageHistory: CoreMessage[] = [
      { role: "user", content: `Please generate the backend based on the following project model:\n${webAppModel}` }
    ];
    await agent.generateFiles(systemPrompt, messageHistory);
  }

  { // generate frontend
    const extractedNotes = await extractNotes(destination);
    const systemPrompt = substituteVariables(frontentPromptTemplate, {
      extractedNotes
    });    
    const messageHistory: CoreMessage[] = [
      { role: "user", content: `Please generate the frontend based on the following project model:\n${webAppModel}` }
    ];
    await agent.generateFiles(systemPrompt, messageHistory);
  }
}

async function extractNotes(destination: string): Promise<string> {
  const notesPath = path.join(destination, "backend", "NOTES.md");
  if (fs.existsSync(notesPath)) {
    return fs.readFileSync(notesPath, 'utf8');
  } else {
    console.warn("NOTES.md file not found ", notesPath);
    return '';
  }
}
