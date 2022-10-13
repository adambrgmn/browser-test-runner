import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, expect, it } from 'browser-test-runner/browser';
import React from 'react';

import { EmailInput } from './create-element.js';

afterEach(() => {
  cleanup();
});

it('creates an element', () => {
  render(<EmailInput />);
  let element = screen.getByLabelText('E-mail:');
  expect(element.classList.contains('input')).to.equal(true);
});

it('is possible to input text', async () => {
  render(<EmailInput />);
  let element = screen.getByLabelText<HTMLInputElement>('E-mail:');
  userEvent.type(element, 'adam@fransvilhelm.com');
  expect(element.value).to.equal('adam@fransvilhelm.com');
});
