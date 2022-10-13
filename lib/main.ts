import { IncomingMessage, Server } from 'node:http';
import process from 'node:process';

import micro from 'micro';

import { prepareRunner } from './server/runner.js';
import { loadSuite } from './server/suite.js';

export async function createTestServer(cwd = process.cwd()) {
  const baseUrl = new URL(`http://localhost:3000`);
  const runner = await prepareRunner();

  const server = micro.default(async (req, res) => {
    const requestUrl = url(req);

    switch (requestUrl.pathname) {
      case '/':
        // Handle serving main test document
        res.setHeader('Content-Type', 'text/html');
        micro.send(
          res,
          200,
          /* HTML */ `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
              </head>
              <body>
                <script type="module" src="/runner"></script>
              </body>
            </html>`,
        );
        break;

      case '/runner': {
        res.setHeader('Content-Type', 'application/javascript');
        micro.send(res, 200, runner.source);
        break;
      }

      case '/suite': {
        let suite = requestUrl.searchParams.get('suite');
        if (typeof suite !== 'string') {
          micro.send(res, 404, 'Test suite not found');
          return;
        }

        let test = await loadSuite(suite, cwd);

        res.setHeader('Content-Type', 'application/javascript');
        micro.send(res, 200, test.source);
        break;
      }
    }
  }) as unknown as Server;

  function listen(port = 3000) {
    baseUrl.port = `${port}`;
    server.listen(Number(baseUrl.port), () => {
      console.log(`Server listening on ${baseUrl.toString()}`);
    });
  }

  return { listen, server } as const;
}

function url(req: IncomingMessage) {
  return new URL(req.url ?? '/', `http://${req.headers.host}`);
}
