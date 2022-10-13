import { expect } from 'expect';

import { Suite } from './Suite.js';
import * as log from './logging.js';
import { Expect2, SuiteResult } from './types.js';

window.expect = expect as Expect2;
const testFiles = ['./src/create-element.test.tsx'];

run();

async function run() {
  let results: Array<SuiteResult> = [];
  try {
    for (let path of testFiles) {
      let suite = new Suite(path);
      await suite.init();
      let suiteResults = await suite.run();
      results.push(suiteResults);
    }

    log.totalResult(results);
  } catch (error) {
    console.error(error);
    console.error('Test runner failed :(');
  }
}
