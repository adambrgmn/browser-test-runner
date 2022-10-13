import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, expect, it } from 'browser-test-runner/browser';
import React from 'react';

import { EmailInput } from './create-element.js';

afterEach(() => {
  cleanup();
});

it('should render an input element with label', () => {
  render(<EmailInput />);
  let element = screen.getByLabelText('E-mail:');
  expect(element).toHaveClass('input');
});

it('should be possible to input text into the element', async () => {
  render(<EmailInput />);
  let element = screen.getByLabelText<HTMLInputElement>('E-mail:');
  await userEvent.type(element, 'adam@fransvilhelm.com');
  expect(element).toHaveValue('adam@fransvilhelm.coms');
});

for (let index of Array.from({ length: 50 }, (_, i) => i + 1)) {
  it(`should be possible to input text into the element ${index}`, async () => {
    let text = Array.from({ length: index }, () => 'a').join(''); // `adam_${index}@fransvilhelm.com`;

    render(<EmailInput />);
    let element = screen.getByLabelText<HTMLInputElement>('E-mail:');
    await userEvent.type(element, text);
    expect(element).toHaveValue(text);
  });
}
