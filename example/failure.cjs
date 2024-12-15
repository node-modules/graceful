"use strict";

var http = require('http');
var express = require('express');
var { graceful } = require('../');

var keepAliveClient = http.request({
  host: 'www.google.com',
  path: '/index.html'
});

var app = express()
.use(function (req, res) {
  if (!keepAliveClient) {
    setTimeout(function () {
      foo2.bar();
    }, 10);
    return;
  }
  keepAliveClient.on('response', function (response) {
    foo.bar();
  });
  keepAliveClient.end();
  keepAliveClient = null;
})
.use(function (err, req, res, next) {
  res.end(err.message);
});

app = app.listen(1984);

var app1 = express().listen(1985);

graceful({
  server: [app, app1],
  killTimeout: '10s',
});
