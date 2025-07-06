# Semiformal Web Apps examples

## Generating web apps

Edit the `.env` file to set the AI model and temperature.

When using Ollama, run `ollama serve` in a terminal.

```sh
# The app is generated in `output/<app-name>/`
npm run generate <models/my-model.swa> <app-name>
```

Please note:

* Local models can run several minutes, while remote models are relatively fast. So be patient.
* Ollama tool calls are sometimes unreliable. If you get an error, try again.
* Enabling debug mode in the `.env` file can help.

## Creating new web app models

Manually create a new .swa file in the `models/` folder<br>
or ask Cursor Chat/GitHub Copilot to create one as a starting point for [vibe coding](https://en.wikipedia.org/wiki/Vibe_coding) 😉

Hint: The AI instructions for vibe coding .swa files are stored in the `.cursor/rules/` and `.github/` folders.

## What's next?

Read our [blog post](https://www.typefox.io/blog/boost-your-ai-apps-with-dsls/) about Semiformal applications.

The web app generator is just one type of Semiformal application. Let us brainstorm together—which other possibilities can you imagine...?

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
