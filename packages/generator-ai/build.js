import { build } from 'esbuild';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

await build({
  entryPoints: ['src/cli.ts'],
  bundle: true,
  outfile: 'out/cli.cjs',
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  external: ['fs', 'path', 'os', 'crypto', 'dotenv'],
  plugins: [
    {
      name: 'md-loader',
      setup(build) {
        build.onLoad({ filter: /\.md$/ }, async (args) => {
          const content = readFileSync(args.path, 'utf8');
          return {
            contents: `module.exports = ${JSON.stringify(content)};`,
            loader: 'js'
          };
        });
      }
    }
  ]
});