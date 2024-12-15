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
  ignoreCode: [ 'EMOCKERROR' ],
});

setTimeout(function() {
  const error = new Error('mock');
  error.code = 'EMOCKERROR';
  throw error;
}, 1000);
