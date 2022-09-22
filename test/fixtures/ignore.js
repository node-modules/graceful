'use strict';

var graceful = require('../../');
var fork = require('child_process').fork;
var path = require('path');

fork(path.join(__dirname, 'worker.js'));


var server = require('http').createServer();
server.listen();
graceful({
  server: server,
  killTimeout: 2000,
  ignoreCode: ['EMOCKERROR']
});

setTimeout(function () {
  const error = new Error('mock');
  error.code = 'EMOCKERROR';
  throw error;
}, 1000);
