import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, expect, it } from 'browser-test-runner/test';
import React from 'react';

import { EmailInput } from './EmailInput.js';

afterEach(cleanup);

it('should render an input element with label', () => {
  render(<EmailInput />);
  let element = screen.getByLabelText('E-mail:');
  expect(element).toHaveClass('input');
});

it('should be possible to input text into the element', async () => {
  render(<EmailInput />);
  let element = screen.getByLabelText<HTMLInputElement>('E-mail:');
  await userEvent.type(element, 'adam@fransvilhelm.coms');
  expect(element).toHaveValue('adam@fransvilhelm.com');
});

for (let index of Array.from({ length: 50 }, (_, i) => i + 1)) {
  it(`should be possible to input text into the element ${index}`, async () => {
    let text = Array.from({ length: index }, () => 'a').join('');
    render(<EmailInput />);
    let element = screen.getByLabelText<HTMLInputElement>('E-mail:');
    fireEvent.change(element, { target: { value: text } });
    expect(element).toHaveValue(text);
  });
}
