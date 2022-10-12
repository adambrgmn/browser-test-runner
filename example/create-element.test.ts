// @ts-expect-error Forced error
import { it } from 'browser-test-runner';

import { createElement } from './create-element';

it('creates an element', () => {
  let element = createElement('div', { class: 'abc' }, 'hello world');
  document.body.appendChild(element);

  let result = document.querySelector('.abc');
  if (!(result instanceof Element)) {
    throw new Error('Element is not an element');
  }

  if (!result.classList.contains('abc')) {
    throw new Error('Element does not have class name "abc"');
  }
});

it('appends attributes provided', async () => {
  let element = createElement('div', { 'aria-hidden': true }, 'hello world');
  await new Promise((r) => setTimeout(r, 2000));
  if (!element.hasAttribute('aria-hidden')) {
    throw new Error('Does not set aria-hidden attribute');
  }
});
