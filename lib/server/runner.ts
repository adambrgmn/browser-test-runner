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
  });

  return { source: result.outputFiles[0]?.text ?? 'throw new Error("Runner not build properly")' } as const;
}
