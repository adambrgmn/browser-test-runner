import chalk from 'chalk';
import { JestAssertionError } from 'expect';

import { SuiteResult, TestResult } from '../browser/types.js';
import * as duration from './duration.js';

interface Message<Context = unknown> {
  level: 'info' | 'error' | 'test-result' | 'suite-result' | 'total-result';
  text: string;
  context?: Context;
}

export class SharedWriter {
  write(message: Message) {
    switch (message.level) {
      case 'info':
        console.info(message.text);
        if (message.context) console.log(message.context);
        break;

      case 'error':
        console.error(message.text);
        if (message.context) console.error(message.context);
        break;

      case 'test-result': {
        let result = message.context as TestResult;
        testResult(result, 'compact');
        break;
      }

      case 'suite-result': {
        break;
      }

      case 'total-result': {
        let result = message.context as SuiteResult[];
        totalResult(result);
        break;
      }

      default:
        throw new Error(`Using unknown message level "${message.level}"`);
    }
  }
}

export function testResult(result: TestResult, format: 'extended' | 'compact') {
  let message = `${result.title} (${duration.format(result.duration)})`;

  switch (result.state) {
    case 'pass':
      console.log(chalk.bgGreen.whiteBright` TEST:SUCCESS `, message);
      break;
    case 'fail':
      console.error(chalk.bgRed.whiteBright` TEST:FAILED `, message);

      if (format === 'extended') {
        if (result.reason instanceof JestAssertionError) {
          console.error(result.reason.stack);
        } else {
          console.error(result.reason);
        }
      }
  }
}

export function totalResult(results: Array<SuiteResult>) {
  let testResults = results.flatMap((res) => res.results);
  let testSuccessCount = testResults.reduce((acc, res) => (acc + res.state === 'pass' ? 1 : 0), 0);
  let testFailCount = testResults.length - testSuccessCount;

  if (testFailCount > 0) {
    console.log(chalk.bgRed.whiteBright`----------- FAILING TESTS -----------`);
  }

  for (let result of testResults) {
    if (result.state === 'fail') {
      testResult(result, 'extended');
    }
  }

  let suiteSuccessCount = results.reduce((acc, res) => (acc + res.state === 'pass' ? 1 : 0), 0);
  let suiteFailCount = results.length - suiteSuccessCount;
  let totalDuration = results.reduce((acc, res) => acc + res.duration, 0);

  console.log([`Suites: ${results.length}`, `Success: ${suiteSuccessCount}`, `Fail: ${suiteFailCount}`].join(' | '));
  console.log([`Tests: ${testResults.length}`, `Success: ${testSuccessCount}`, `Fail: ${testFailCount}`].join(' | '));
  console.log([`Duration: ${duration.format(totalDuration)}`].join(' | '));
}
