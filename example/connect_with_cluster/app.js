/*!
 * graceful - example/connect-with-cluster/app.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var http = require('http');
var connect = require('connect');

var app = connect(
  function (req, res, next) {
    req.on('end', function () {
      if (req.url === '/asycerror') {
        setTimeout(function () {
          foo.bar();
        }, 10);
        return;
      }
      res.end(req.method + ' ' + req.url + ', headers: ' + JSON.stringify(req.headers));
    });
    req.resume();
  },
  function (err, req, res, next) {
    var domainThrown = err.domain_thrown || err.domainThrown;
    var msg = 'domainThrown: ' + domainThrown + '\n' + err.stack;
    console.error('%s %s\n%s', req.method, req.url, msg);
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain');
    res.end(msg + '\n');
  }
);

var server = http.createServer(app);
module.exports = server;

