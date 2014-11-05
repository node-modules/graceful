/**!
 * graceful - example/express_with_cluster/app.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var http = require('http');
var express = require('express');

var app = express();
app.use(function (req, res, next) {
  req.on('end', function () {
    if (req.url === '/asyncerror') {
      setTimeout(function () {
        foo.bar();
      }, 10);
      return;
    }
    process.nextTick(function () {
      res.setHeader('content-type', 'text/json');
      res.end(JSON.stringify({
        method: req.method,
        url: req.url,
        headers: req.headers,
        Connection: res.getHeader('connection') || 'keep-alive',
        pid: process.pid,
      }));
    });
  });
  req.resume();
})
.use(function (err, req, res, next) {
  var domainThrown = err.domain_thrown || err.domainThrown;
  var msg = 'domainThrown: ' + domainThrown + '\n' + err.stack;
  console.error('%s %s\n%s', req.method, req.url, msg);
  res.statusCode = 500;
  res.setHeader('content-type', 'text/plain');
  res.end(msg + '\n');
});

var server = http.createServer(app);
module.exports = server;
