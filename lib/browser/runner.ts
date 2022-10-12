import * as duration from '../utils/duration.js';

const testFiles = ['./example/create-element.test.ts'];

const tests = new Map<string, () => void | Promise<void>>();

run();

async function run() {
  try {
    for (let path of testFiles) {
      let url = new URL('/suite', window.location.origin);
      url.searchParams.set('suite', path);
      await import(url.toString());

      for (let [name, callback] of tests) {
        console.log(`RUNNING: ${name}`);
        let start = performance.now();
        try {
          await callback();
          let delta = performance.now() - start;
          console.log(`SUCCESS: ${name} (${duration.format(delta)})`);
        } catch (error) {
          let delta = performance.now() - start;
          console.error(`FAILED: ${name} (${duration.format(delta)})`);
          console.error(error);
        }

        cleanup();
      }
    }
  } catch (error) {
    console.error(error);
    console.error('Test runner failed :(');
  }
}

window.it = it;
function it(title: string, callback: () => void | Promise<void>) {
  tests.set(title, callback);
}

function cleanup() {
  let children = Array.from(document.body.childNodes);
  for (let child of children) {
    document.body.removeChild(child);
  }
}

declare global {
  interface Window {
    it: typeof it;
  }
}
