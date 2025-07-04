# Semiformal Web Apps

This is a project template for the Coding.Waterkant 2025, consiting of a **Langium grammar** defining the Semiformal Web Apps (SWA) language, a **VSCode extension** for editing SWA files and a **CLI** that uses AI for generating Web Apps based on the SWA language

## Prerequisites

* Install [Cursor](https://www.cursor.com/) (recommended) or [VSCode](https://code.visualstudio.com/) (no AI support for creating new examples)
* Install Node LTS (v22.17.0)
  <details>
    <ol>
      <li><a href='https://github.com/tj/n?tab=readme-ov-file#installation'>Install n</a> (Node version manager)</li>
      <li>Install Node LTS <code>n lts</code></li>
    </ol>
  </details>

## Usage

1. Install dependencies (once):
   ```sh
   npm i
   ```
2. Build the grammar (on grammar changes):
   ```sh
   npm run build
   ```
3. Edit example models:
   ```sh
   code . # then press F5 to run the language extension in VSCode
   ```

## Important files

```py
./packages/
├─ example-web-apps/
│  ├─ .cursor/rules/
│  │  └─ semiform-rules.mdc # Example generator instructions
│  └─ *.swa                 # Semiformal Web App models
└─ semiformal-web-apps/
   └─ src/
      └─ language/
         └─ semiformal-web-apps.langium # Langium grammar
```
