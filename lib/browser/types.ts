/* eslint-disable no-var */
import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers.js';
import { AsymmetricMatchers, BaseExpect, Matchers as OriginalMatchers, expect } from 'expect';

declare global {
  interface Window {
    expect: Expect2;
    it(title: string, callback: Callback): void;
    before(callback: Callback): void;
    beforeEach(callback: Callback): void;
    after(callback: Callback): void;
    afterEach(callback: Callback): void;
  }
}

export type Callback = () => void | Promise<void>;
export type Phase = 'before' | 'beforeEach' | 'after' | 'afterEach';

export type State = 'pass' | 'fail';

export type TestResult =
  | { state: 'pass'; title: string; duration: number }
  | { state: 'fail'; title: string; duration: number; reason: unknown };

export type SuiteResult = { state: State; file: string; duration: number; results: Array<TestResult> };

export type Matchers<R extends void | Promise<void>> = OriginalMatchers<R> &
  TestingLibraryMatchers<typeof expect.stringContaining, R>;

export type Expect2 = {
  <T = unknown>(actual: T): Matchers<void> & Inverse<Matchers<void>> & PromiseMatchers;
} & BaseExpect &
  AsymmetricMatchers &
  Inverse<Omit<AsymmetricMatchers, 'any' | 'anything'>>;

interface Inverse<Matchers> {
  not: Matchers;
}

type PromiseMatchers = {
  /**
   * Unwraps the reason of a rejected promise so any other matcher can be chained.
   * If the promise is fulfilled the assertion fails.
   */
  rejects: Matchers<Promise<void>> & Inverse<Matchers<Promise<void>>>;
  /**
   * Unwraps the value of a fulfilled promise so any other matcher can be chained.
   * If the promise is rejected the assertion fails.
   */
  resolves: Matchers<Promise<void>> & Inverse<Matchers<Promise<void>>>;
};
