import { createTestServer } from './main.js';

(async () => {
  let server = await createTestServer();
  server.listen();
})();
