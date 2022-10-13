import * as mod from 'node:module';
import * as path from 'node:path';

import * as esbuild from 'esbuild';

import { dirname } from '../utils/dirname.js';

export async function prepareRunner() {
  const result = await esbuild.build({
    entryPoints: [path.join(dirname(import.meta.url), '../browser/runner.js')],
    bundle: true,
    target: 'es2020',
    format: 'esm',
    platform: 'browser',
    sourcemap: 'inline',
    write: false,
    define: {
      'process.env.NODE_ENV': JSON.stringify('test'),
      'process.env.CI': JSON.stringify(false),
      'process.env.TERM': JSON.stringify('dumb'),
      'process.stdout.isTTY': JSON.stringify(false),
      'process.platform': JSON.stringify('browser'),
      process: JSON.stringify({ env: { NODE_ENV: 'test' } }),
    },
    plugins: [builtins(), alias()],
  });

  return { source: result.outputFiles[0]?.text ?? 'throw new Error("Runner not build properly")' } as const;
}

function builtins(): esbuild.Plugin {
  let namespace = 'browser-test-runner-builtin';
  let builtins = mod.builtinModules.map((m) => m.replace('/', '\\/')).join('|');
  let re = new RegExp(`^(${builtins})$`);

  let fallbackContent = `export {}`;
  let contents: Record<string, string> = {
    process: `module.exports = { env: { NODE_ENV: 'test' } }`,
  };

  return {
    name: namespace,
    setup(build) {
      build.onResolve({ filter: re }, (args) => {
        return { path: args.path, namespace };
      });

      build.onLoad({ filter: /.*/, namespace }, (args) => {
        return { contents: contents[args.path] ?? fallbackContent, loader: 'js' };
      });
    },
  };
}

function alias(): esbuild.Plugin {
  let namespace = 'browser-test-runner-alias';

  let modules: Record<string, string> = {
    'graceful-fs': `
      module.exports = {}
    `,
  };

  let overrides = Object.keys(modules)
    .map((m) => m.replace('/', '\\/'))
    .join('|');
  let re = new RegExp(`^(${overrides})$`);

  return {
    name: namespace,
    setup(build) {
      build.onResolve({ filter: re }, (args) => ({
        path: args.path,
        namespace,
      }));

      build.onLoad({ filter: /.*/, namespace }, (args) => {
        return { contents: modules[args.path], loader: 'ts' };
      });
    },
  };
}
