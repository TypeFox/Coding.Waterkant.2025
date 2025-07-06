#!/usr/bin/env node

import 'dotenv/config';
import { createAgent } from './agent.js';
import { generate } from './generator.js';

// Entry point for the CLI
main().then(() => {
  process.exit(0);
}).catch(error => {
  console.error(error);
  process.exit(1);
});

async function main(): Promise<void> {

  // Parse environment variables
  const apiKey = process.env.API_KEY;
  const baseURL = process.env.BASE_URL;
  const [ providerName, modelName ] = (process.env.MODEL || '').replace(/^([^:]*):(.*)$/, '$1,$2').split(',');
  const maxTokens = parseInt(process.env.MAX_TOKENS || "4096");
  const temperature = parseFloat(process.env.TEMPERATURE || "0.0");
  const debug = process.env.DEBUG === 'true';

  // Parse command line arguments
  const destination = process.argv[2] || '.';
  const webAppModel = await processStdin();

  // Create agent
  const agent = createAgent(destination, { apiKey, baseURL, providerName, modelName, maxTokens, temperature, debug });
  await generate(agent, webAppModel, destination);

  console.log('\n🤗 Generator AI finished successfully.');
  console.log(`👉 Follow the instructions in the ${destination}/backend/README.md and ${destination}/frontend/README.md files to run the app.`);
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
