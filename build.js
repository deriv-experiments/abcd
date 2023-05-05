import esbuild from 'esbuild';
import { promises as fs } from 'fs';
import chokidar from 'chokidar';
import debounce from 'debounce';

async function build () {
  await fs.cp('example', 'dist', { recursive: true });

  await Promise.all([
    esbuild.build({
      bundle: true,
      minify: false,
      entryPoints: ['./src/index.ts'],
      outfile: 'dist/index.js',
      loader: {
        '.ts': 'ts'
      },
      sourcemap: true,
      target: 'node19',
      platform: 'node',
      format: 'esm'
    }),

    esbuild.build({
      bundle: true,
      minify: true,
      entryPoints: ['./src/index.ts'],
      outfile: 'dist/abcd.min.js',
      loader: {
        '.ts': 'ts'
      },
      sourcemap: true
    })
  ]);
}

if (process.argv[2] === '--watch' || process.argv[2] === '-w') {
  chokidar.watch('src/**/*', { ignoreInitial: false }).on('all', debounce(build, 100));
  console.log('watching for changes');
} else {
  build();
}
