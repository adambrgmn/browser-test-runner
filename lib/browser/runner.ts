import { AssertionError, assert, expect, should } from 'chai';

import * as duration from '../utils/duration.js';

const testFiles = ['./example/src/create-element.test.tsx'];

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
          if (error instanceof AssertionError) {
            console.error(error.message);
            console.error(error.stack);
          } else {
            console.error(error);
          }
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

window.assert = assert;
window.expect = expect;
window.should = should as unknown as any;

window.it = it;
export function it(title: string, callback: Callback) {
  tests.set(title, callback);
}

window.before = before;
export function before(callback: Callback) {
  phaseCallbacks.add(['before', callback]);
}

window.beforeEach = beforeEach;
export function beforeEach(callback: Callback) {
  phaseCallbacks.add(['beforeEach', callback]);
}

window.after = after;
export function after(callback: Callback) {
  phaseCallbacks.add(['after', callback]);
}

window.afterEach = afterEach;
export function afterEach(callback: Callback) {
  phaseCallbacks.add(['afterEach', callback]);
}
