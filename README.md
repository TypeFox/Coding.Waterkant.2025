# Semiformal Web Apps

This is a project template for the Coding.Waterkant 2025, consiting of a **Langium grammar** defining the Semiformal Web Apps (SWA) language, a **VSCode extension** for editing SWA files and a **CLI** that uses AI for generating Web Apps based on the SWA language

## Prerequisites

* Install [VSCode](https://code.visualstudio.com/) or [Cursor](https://www.cursor.com/)
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

## Important files

```py
./packages/
├─ semiformal-web-apps/
│  ├─ src/
│  │  ├─ language/
│  │  │  ├─ semiformal-web-apps.langium  # Langium grammar
```
