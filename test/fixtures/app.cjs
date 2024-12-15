/* eslint-disable @typescript-eslint/no-var-requires */
const { fork } = require('node:child_process');
const path = require('node:path');
const { createServer } = require('node:http');
const { graceful } = require('../../');

fork(path.join(__dirname, 'worker.cjs'));

const server = createServer();
server.listen();
graceful({
  server,
  killTimeout: 2000,
});

setTimeout(function() {
  throw new Error('wow');
}, 100);
