import { assert, expect, should } from 'chai';

import { after, afterEach, before, beforeEach, it } from './runner.js';

declare global {
  interface Window {
    assert: typeof assert;
    expect: typeof expect;
    should: typeof should;

    it: typeof it;
    before: typeof before;
    beforeEach: typeof beforeEach;
    after: typeof after;
    afterEach: typeof afterEach;
  }
}
