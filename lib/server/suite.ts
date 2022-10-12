import * as path from 'node:path';

import * as esbuild from 'esbuild';

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
    plugins: [alias()],
  });

  return { source: result.outputFiles[0]?.text ?? 'throw new Error("Module not built properly")' } as const;
}

function alias(): esbuild.Plugin {
  let namespace = 'browser-test-runner-alias';

  return {
    name: 'browser-test-runner-alias',
    setup(build) {
      build.onResolve({ filter: /^browser-test-runner$/ }, (args) => ({
        path: args.path,
        namespace,
      }));

      build.onLoad({ filter: /.*/, namespace }, () => {
        let contents = `
          export const it = window.it;
          export const before = window.before;
          export const beforeEach = window.beforeEach;
          export const after = window.after;
          export const afterEach = window.afterEach;
        `;

        return { contents, loader: 'ts' };
      });
    },
  };
}
