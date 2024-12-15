/* eslint-disable @typescript-eslint/ban-ts-comment */
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import request from 'supertest';
import express from 'express';
import { graceful } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('test/graceful.test.ts', () => {
  function normalHandler(req: any, res: any) {
    if (req.url === '/sync_error') {
      throw new Error('sync_error');
    }
    if (req.url === '/async_error') {
      process.nextTick(function() {
        // @ts-ignore
        ff.foo();
      });
      return;
    }
    if (req.url === '/async_error_twice') {
      setTimeout(function() {
        // @ts-ignore
        ff.foo();
      }, 100);
      setTimeout(function() {
        // @ts-ignore
        bar.bar();
      }, 200);
      return;
    }
    if (req.url === '/async_error_triple') {
      setTimeout(function() {
        // @ts-ignore
        ff.foo();
      }, 100);
      setTimeout(function() {
        // @ts-ignore
        bar.bar();
      }, 200);
      setTimeout(function() {
        // @ts-ignore
        hehe.bar();
      }, 200);
      return;
    }
    res.end(req.url);
  }

  function errorHandler(err: any, _req: any, res: any) {
    res.statusCode = 500;
    res.end(err.message);
  }

  const server = http.createServer();
  graceful({ server, killTimeout: '1s' });

  const app = express()
    .use('/public', express.static(__dirname + '/fixtures'))
    .use(normalHandler)
    .use(errorHandler);

  server.on('request', app);

  it('should GET / status 200', function(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });

  it('should GET /public/foo.js status 200', function(done) {
    request(server)
      .get('/public/foo.js')
      .expect('console.log(\'bar\');\n')
      .expect(200, done);
  });

  it('should GET /sync_error status 500', function(done) {
    request(server)
      .get('/sync_error')
      .expect(/sync_error/)
      .expect(500, done);
  });
});
