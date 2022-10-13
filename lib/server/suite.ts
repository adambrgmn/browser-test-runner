import { createRequire } from 'node:module';
import * as path from 'node:path';

import * as esbuild from 'esbuild';

const require = createRequire(import.meta.url);

export async function loadSuite(testFile: string, cwd: string) {
  let filePath = path.join(cwd, testFile);

  const result = await esbuild.build({
    entryPoints: [filePath],
    bundle: true,
    target: 'es2020',
    format: 'esm',
    platform: 'browser',
    sourcemap: 'inline',
    write: false,
    inject: [require.resolve('@testing-library/jest-dom')],
  });

  return { source: result.outputFiles[0]?.text ?? 'throw new Error("Module not built properly")' } as const;
}
