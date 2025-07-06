# Semiformal Web Apps

This is a project contributed by TypeFox to Coding.Waterkant 2025.

While this project demonstrates AI-powered web app generation, its primary purpose is to introduce the [Semiformal](https://www.typefox.io/blog/boost-your-ai-apps-with-dsls/) approach for bidirectional human-AI interactions.

The project consists of a **Langium grammar** defining the Semiformal Web Apps (SWA) language, a **VSCode extension** for editing SWA files, and a **CLI** that uses AI to generate web apps based on SWA specifications.

## Prerequisites

* Install Node LTS (v22.17.0)
  <details>
    <ol>
      <li><a href='https://github.com/tj/n?tab=readme-ov-file#installation'>Install n</a> (Node version manager)</li>
      <li>Install Node LTS: <code>n lts</code></li>
    </ol>
  </details>
* Install [Cursor IDE](https://www.cursor.com/) (recommended) or [VSCode](https://code.visualstudio.com/) (no AI support for creating new examples)
* Install [Docker](https://www.docker.com/) for running the example web apps
* Install [Ollama](https://ollama.ai/) for using AI models locally
  <details>
    <ol>
      <li>Download and install Ollama from <a href='https://ollama.ai/'>https://ollama.ai/</a></li>
      <li>Run Ollama.app and allow to expose it to the network</li>
      <li>Pull the Qwen3 14B model: <code>ollama pull qwen3:14b</code></li>
    </ol>
  </details>

## Installation

1. Install dependencies (once):
   ```sh
   npm i
   ```
2. Build the projects (when language or generator changes):
   ```sh
   npm run clean && npm run build
   ```

## Usage

1. Open the project in Cursor/VSCode:
   ```sh
   code .
   ```
2. Press `F5` to open a new IDE instance with the language extension loaded. The workspace will be the `example-web-apps/` folder.
3. Create your own `.env` file by copying `.env.template` and filling in your values.

```yaml
# Only showing selected files
example-web-apps/
├─ models/
│  └─ *.swa # Semiformal Web App models
├─ output/
│  └─ */ # Generated web apps
├─ .env.template # AI generator config template
└─ .env # Your personal copy of .env.template used by the generator
```

From there you can:

* Edit existing web app model files `models/*.swa` that describe a web app's structure
* Generate a new web app based on a .swa model (when using Ollama, run `ollama serve` in a terminal):
  ```sh
  # The app is generated in `output/<app-name>/`
  npm run generate <models/my-model.swa> <app-name>
  ```

To create new types of web apps:

* Manually create a new .swa file in the `models/` folder<br>
  or ask Cursor Chat/GitHub Copilot to create one as a starting point for [vibe coding](https://en.wikipedia.org/wiki/Vibe_coding) 😉
* Then follow the steps above to generate the web app

Hint: The AI instructions for vibe coding .swa files are stored in the `.cursor/rules/` and `.github/` folders.

```yaml
# Only showing selected files
example-web-apps/
├─ .cursor/rules/
│  └─ semiform-rules.mdc # Cursor instructions for creating .swa files
└─ .github/
   └─ copilot-instructions.md # Copilot instructions for creating .swa files
```

## Modifying the language or generator

To modify the language or generator, edit the source code in the `packages/` folder.

```yaml
# Only showing selected files
packages/
├─ generator-ai/ # AI generator for web apps
│  └─ src/prompt-templates/
│     ├─ backend-prompt.md # Backend prompt template
│     └─ frontend-prompt.md # Frontend prompt template
└─ semiformal-web-apps/ # IDE language support powered by Langium
   └─ src/language/
      └─ semiformal-web-apps.langium # Langium grammar for .swa files
```

Remember to rebuild after changing the source code:

```sh
npm run clean && npm run build
```

Note: AI instructions and prompts may need to be updated to use the new language.

## What's next?

Read our [blog post](https://www.typefox.io/blog/boost-your-ai-apps-with-dsls/) about Semiformal applications.

The web app generator is just one type of Semiformal application. Let us brainstorm together—which other possibilities can you imagine...?

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
