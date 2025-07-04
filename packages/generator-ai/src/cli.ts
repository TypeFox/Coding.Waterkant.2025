#!/usr/bin/env node

import 'dotenv/config';
import { createAgent } from './agent.js';
import { generate } from './generator.js';

// Entry point for the CLI
main().then(() => {
  console.log('\n🤗 Generator AI finished successfully');
  process.exit(0);
}).catch(error => {
  console.error(error);
  process.exit(1);
});

async function main(): Promise<void> {

  // Parse command line arguments
  const apiKey = process.env.API_KEY || '';
  const [ providerName, modelName ] = (process.env.MODEL || '').split(':');
  const maxTokens = process.env.MAX_TOKENS || '4096';
  const temperature = process.env.TEMPERATURE || '0.2';
  const destination = process.argv[2] || '.';
  const webAppModel = await processStdin();

  // Create agent
  const agent = createAgent(destination, { apiKey, providerName, modelName, maxTokens: parseInt(maxTokens), temperature: parseFloat(temperature) });
  return generate(agent, webAppModel, destination);
}

async function processStdin(): Promise<string> {
  return new Promise((resolve, reject) => {

    let input = '';

    process.stdin.setEncoding('utf8');
  
    // Handle case where data is received from stdin
    process.stdin.on('data', (chunk) => {
      input += chunk;
    });
  
    // Handle case where stdin is closed
    process.stdin.on('end', () => {
      resolve(input);
    });
  
    // Handle case where stdin is already closed
    if (process.stdin.isTTY) {
      reject(new Error('No input provided via stdin'));
    }
  });

}
