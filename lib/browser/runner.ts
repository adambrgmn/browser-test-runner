import * as duration from '../utils/duration.js';

const testFiles = ['./example/create-element.test.tsx'];

type Callback = () => void | Promise<void>;
type Phase = 'before' | 'beforeEach' | 'after' | 'afterEach';

const tests = new Map<string, Callback>();
const phaseCallbacks = new Set<[Phase, Callback]>();

run();

async function run() {
  try {
    for (let path of testFiles) {
      let url = new URL('/suite', window.location.origin);
      url.searchParams.set('suite', path);

      await import(url.toString());

      await runPhase('before');

      for (let [name, callback] of tests) {
        await runPhase('beforeEach');

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

        await runPhase('afterEach');
      }

      await runPhase('after');

      tests.clear();
      phaseCallbacks.clear();
    }
  } catch (error) {
    console.error(error);
    console.error('Test runner failed :(');
  }
}

async function runPhase(phase: Phase) {
  for (let [p, callback] of phaseCallbacks) {
    if (p === phase) await callback();
  }
}

window.it = it;
function it(title: string, callback: Callback) {
  tests.set(title, callback);
}

window.before = before;
function before(callback: Callback) {
  phaseCallbacks.add(['before', callback]);
}

window.beforeEach = beforeEach;
function beforeEach(callback: Callback) {
  phaseCallbacks.add(['beforeEach', callback]);
}

window.after = after;
function after(callback: Callback) {
  phaseCallbacks.add(['after', callback]);
}

window.afterEach = afterEach;
function afterEach(callback: Callback) {
  phaseCallbacks.add(['afterEach', callback]);
}

declare global {
  interface Window {
    it: typeof it;
    before: typeof before;
    beforeEach: typeof beforeEach;
    after: typeof after;
    afterEach: typeof afterEach;
  }
}
