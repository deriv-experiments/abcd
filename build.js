import esbuild from 'esbuild';
import { promises as fs } from 'fs';
import chokidar from 'chokidar';
import debounce from 'debounce';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

async function build() {
  await fs.cp('example', 'dist', { recursive: true })

  esbuild.buildSync({
    bundle: true,
    minify: true,
    entryPoints: ['./src/index.ts'],
    outfile: 'dist/abcd.min.js',
    loader: {
      '.ts': 'ts'
    },
    sourcemap: true
  });
}

if (process.argv[2] === '--watch' || process.argv[2] === '-w') {
  chokidar.watch('src/**/*', { ignoreInitial: false }).on('all', debounce(build, 100));
  console.log('watching for changes');
} else {
  build();
}