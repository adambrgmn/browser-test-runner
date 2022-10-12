import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, it } from 'browser-test-runner';
import React from 'react';

import { EmailInput } from './create-element';

afterEach(() => {
  cleanup();
});

it('creates an element', () => {
  render(<EmailInput />);

  let element = screen.getByLabelText('E-mail:');
  if (!element.classList.contains('input')) {
    throw new Error('Element does not have class name "input"');
  }
});

it('is possible to input text', async () => {
  render(<EmailInput />);
  let element = screen.getByLabelText('E-mail:');

  await userEvent.type(element, 'adam@fransvilhelm.com');

  if (!(element instanceof HTMLInputElement) || element.value !== 'adam@fransvilhelm.com') {
    throw new Error('incorrect value');
  }
});
