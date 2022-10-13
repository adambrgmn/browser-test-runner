import path from 'node:path';
import process from 'node:process';

import { createTestServer } from './main.js';

let server = await createTestServer(path.join(process.cwd(), '/example'));
server.listen();
