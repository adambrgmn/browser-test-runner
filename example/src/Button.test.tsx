import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, expect, it } from 'browser-test-runner/test';
import React from 'react';

import { Button } from './Button.js';

afterEach(cleanup);

it('renders button that takes on click handler', async () => {
  let clickCount = 0;
  render(
    <Button
      onClick={() => {
        clickCount += 1;
      }}
    >
      Hello
    </Button>,
  );

  let element = screen.getByRole('button');
  await userEvent.click(element);
  expect(clickCount).toBe(1);
});
