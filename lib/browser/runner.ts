import { expect } from 'expect';

import { SharedWriter } from '../utils/shared-writer.js';
import { Logger, ServerWriter } from './Logger.js';
import { Suite } from './Suite.js';
import { Expect2, SuiteResult } from './types.js';

window.expect = expect as Expect2;
const testFiles = ['./src/Button.test.tsx', './src/EmailInput.test.tsx'];

let results: Array<SuiteResult> = [];

let logger = new Logger([new SharedWriter(), new ServerWriter()]);
await logger.init();

try {
  for (let path of testFiles) {
    let suite = new Suite(path, logger);
    await suite.init();

    let result = await suite.run();
    results.push(result);
  }

  logger.write({ level: 'total-result', text: 'All tests completed', context: results });
} catch (error) {
  logger.write({ level: 'error', text: 'Test runner failed :(', context: error });
}

await logger.close();
