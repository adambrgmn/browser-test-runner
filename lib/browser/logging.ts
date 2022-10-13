import chalk from 'chalk';
import { JestAssertionError } from 'expect';

import * as duration from '../utils/duration.js';
import { TestResult } from './types.js';

type Format = 'extended' | 'compact';

export function testResult(result: TestResult, format: Format) {
  let message = `${result.title} (${duration.format(result.duration)})`;

  switch (result.state) {
    case 'pass':
      console.log(chalk.bgGreen.whiteBright(' TEST:SUCCESS '), message);
      break;
    case 'fail':
      console.error(chalk.bgRed.whiteBright(' TEST:FAILED '), message);

      if (format === 'extended') {
        if (result.reason instanceof JestAssertionError) {
          console.error(result.reason.stack);
        } else {
          console.error(result.reason);
        }
      }
  }
}
