/**!
 * graceful - test/graceful.test.js
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

var cluster = require('cluster');
var http = require('http');
var request = require('supertest');
var express = require('express');
var graceful = require('../');

describe('graceful.test.js', function () {
  function normalHandler(req, res, next) {
    if (req.url === '/sync_error') {
      throw new Error('sync_error');
    }
    if (req.url === '/async_error') {
      process.nextTick(function () {
        ff.foo();
      });
      return;
    }
    if (req.url === '/async_error_twice') {
      setTimeout(function () {
        ff.foo();
      }, 100);
      setTimeout(function () {
        bar.bar();
      }, 200);
      return;
    }
    if (req.url === '/async_error_triple') {
      setTimeout(function () {
        ff.foo();
      }, 100);
      setTimeout(function () {
        bar.bar();
      }, 200);
      setTimeout(function () {
        hehe.bar();
      }, 200);
      return;
    }
    res.end(req.url);
  }

  function errorHandler(err, req, res, next) {
    res.statusCode = 500;
    res.end(err.message);
  }

  var server = http.createServer();
  graceful({ server: server, killTimeout: '1s' });

  var app = express()
  .use('/public', express.static(__dirname + '/fixtures'))
  .use(normalHandler)
  .use(errorHandler);

  server.on('request', app);

  it('should GET / status 200', function (done) {
    request(server)
    .get('/')
    .expect(200, done);
  });

  it('should GET /public/foo.js status 200', function (done) {
    request(server)
    .get('/public/foo.js')
    .expect('console.log(\'bar\');')
    .expect(200, done);
  });

  it('should GET /sync_error status 500', function (done) {
    request(server)
    .get('/sync_error')
    .expect('sync_error')
    .expect(500, done);
  });

  describe.skip('hack for async error', function () {
    // Because `domain` will still throw `uncaughtException`, we need to hack for `mocha` test.
    // https://github.com/joyent/node/issues/4375
    // https://gist.github.com/4179636
    var mochaHandler;
    before(function () {
      mochaHandler = process.listeners('uncaughtException').pop();
    });
    after(function (done) {
      setTimeout(function () {
        // ...but be sure to re-enable mocha's error handler
        process.on('uncaughtException', mochaHandler);
        done();
      }, 2000);
    });

    beforeEach(function () {
      cluster.worker = {
        disconnect: function () {}
      };
    });
    afterEach(function () {
      delete cluster.worker;
    });

    it('should GET /async_error status 500', function (done) {
      delete cluster.worker.disconnect;
      request(server)
      .get('/async_error')
      .expect('ff is not defined')
      .expect(500, done);
    });

    it('should GET /async_error_twice status 500', function (done) {
      request(server)
      .get('/async_error_twice')
      .expect('ff is not defined')
      .expect(500, done);
    });

    it('should GET /async_error_triple status 500', function (done) {
      request(server)
      .get('/async_error_triple')
      .expect('ff is not defined')
      .expect(500, done);
    });
  });
});
