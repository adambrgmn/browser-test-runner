import process from 'node:process';

import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import { prepareRunner } from './server/runner.js';
import { loadSuite } from './server/suite.js';
import { SharedWriter } from './utils/shared-writer.js';

export async function createTestServer(cwd = process.cwd()) {
  const runner = await prepareRunner();

  const app = new Hono({ strict: true });
  const writer = new SharedWriter();

  app.get('/', (context) => {
    return context.html(html`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
        </head>
        <body>
          <script type="module">
            ${runner.source};
          </script>
        </body>
      </html>`);
  });

  app.get('/suite', async (context) => {
    let suite = context.req.query('suite');
    if (typeof suite !== 'string') return context.notFound();

    let test = await loadSuite(decodeURIComponent(suite), cwd);
    return context.body(test.source, 200, { 'Content-Type': 'application/javascript' });
  });

  app.post('/log', async (context) => {
    let message = await context.req.json();
    writer.write(message);
    return context.json({ success: true });
  });

  function listen(port = 3000) {
    return serve({ ...app, port });
  }

  return { listen, app } as const;
}

function html(parts: TemplateStringsArray, ...interpolated: string[]): string {
  let result = '';

  for (let part of parts) {
    result += part;
    let interpolation = interpolated.shift();
    if (interpolation != null) result += interpolation;
  }

  return result;
}
