import { Logger } from './Logger.js';
import { Callback, Phase, SuiteResult, TestResult } from './types.js';

export class Suite {
  #tests = new Array<[string, Callback]>();
  #phaseCallbacks = new Array<[Phase, Callback]>();

  #filePath: string;
  #log: Logger;

  constructor(filePath: string, logger: Logger) {
    this.#filePath = filePath;
    this.#log = logger;
  }

  async init() {
    window.it = (title, callback) => this.#tests.push([title, callback]);
    window.before = this.#createPhaseCallback('before');
    window.beforeEach = this.#createPhaseCallback('beforeEach');
    window.after = this.#createPhaseCallback('after');
    window.afterEach = this.#createPhaseCallback('afterEach');

    let url = new URL('/suite', import.meta.url);
    url.searchParams.set('suite', this.#filePath);
    await import(url.toString());
  }

  async run(): Promise<SuiteResult> {
    let start = performance.now();

    let results: Array<TestResult> = [];

    await this.#runPhaseCallbacks('before');

    while (this.#tests.length > 0) {
      let test = this.#tests.shift();
      if (test == null) break;
      let result = await this.#runTest(...test);
      this.#log.write({ level: 'test-result', text: 'Test completed', context: result });
      results.push(result);
    }

    await this.#runPhaseCallbacks('after');

    let passed = results.every((res) => res.state === 'pass');

    return {
      state: passed ? 'pass' : 'fail',
      duration: performance.now() - start,
      file: this.#filePath,
      results,
    };
  }

  async #runTest(title: string, callback: Callback): Promise<TestResult> {
    let start = performance.now();
    let reason: unknown | undefined = undefined;

    await this.#runPhaseCallbacks('beforeEach');

    try {
      await callback();
    } catch (error) {
      reason = error;
    }

    await this.#runPhaseCallbacks('afterEach');

    let duration = performance.now() - start;

    if (reason != null) return { title, duration, state: 'fail', reason };
    return { title, duration, state: 'pass' };
  }

  async #runPhaseCallbacks(phase: Phase) {
    for (let [p, callback] of this.#phaseCallbacks) {
      if (p === phase) await callback();
    }
  }

  #createPhaseCallback(phase: Phase) {
    return (callback: Callback) => this.#phaseCallbacks.push([phase, callback]);
  }
}
