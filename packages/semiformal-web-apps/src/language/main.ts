import { startLanguageServer } from 'langium/lsp';
import { NodeFileSystem } from 'langium/node';
import { createConnection, ProposedFeatures } from 'vscode-languageserver/node.js';
import { createSemiformalWebAppsServices } from './semiformal-web-apps-module.js';

// Create a connection to the client
const connection = createConnection(ProposedFeatures.all);

// Inject the shared services and language-specific services
const { shared } = createSemiformalWebAppsServices({ connection, ...NodeFileSystem });

// Start the language server with the shared services
startLanguageServer(shared);
