/*!
 * graceful - example/connect_with_cluster/dispatch.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var PORT = +process.env.PORT || 1337;
var graceful = require('../../');
var server = require('./app');
server.listen(PORT);
console.log('[%s] [worker:%s] web server start listen on %s', new Date(), process.pid, PORT);

var restapi = require('http').createServer().listen(1985);
console.log('[%s] [worker:%s] rest api start listen on %s', new Date(), process.pid, 1985);

graceful({
  server: [server, restapi],
  killTimeout: 10000,
  error: function (err, throwErrorCount) {
    // you can do custom log here, send email, call phone and so on...
    if (err.message) {
      err.message += ' (uncaughtException throw ' + throwErrorCount + ' times on pid:' + process.pid + ')';
    }
    // logger.error(err);
  }
});
