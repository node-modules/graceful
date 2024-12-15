# graceful

[![NPM version][npm-image]][npm-url]
[![Test coverage][cov-image]][cov-url]
[![npm download][download-image]][download-url]
[![Node.js Version](https://img.shields.io/node/v/graceful.svg?style=flat)](https://nodejs.org/en/download/)

[npm-image]: https://img.shields.io/npm/v/graceful.svg?style=flat-square
[npm-url]: https://npmjs.org/package/graceful
[cov-image]: https://codecov.io/github/node-modules/graceful/coverage.svg?branch=master
[cov-url]: https://codecov.io/github/node-modules/graceful?branch=master
[download-image]: https://img.shields.io/npm/dm/graceful.svg?style=flat-square
[download-url]: https://npmjs.org/package/graceful

Graceful exit when `uncaughtException` emit, base on `process.on('uncaughtException')`.

## Why we should use this module

It's the best way to handle `uncaughtException` on current situations.

* [Node.js 异步异常的处理与domain模块解析](http://deadhorse.me/nodejs/2013/04/13/exception_and_domain.html)

## Install

```bash
npm install graceful
```

## Usage

Please see [express_with_cluster](https://github.com/node-modules/graceful/tree/master/example/express_with_cluster) example.

This below code just for dev demo, don't use it on production env:

```js
const express = require('express');
const { graceful } = require('graceful');

const app = express()
.use()
.use(function(req, res){
  if (Math.random() > 0.5) {
    foo.bar();
  }
  setTimeout(function() {
    if (Math.random() > 0.5) {
      throw new Error('Asynchronous error from timeout');
    } else {
      res.end('Hello from Connect!');
    }
  }, 100);
  setTimeout(function() {
    if (Math.random() > 0.5) {
      throw new Error('Mock second error');
    }
  }, 200);
})
.use(function(err, req, res, next) {
  res.end(err.message);
});

const server = app.listen(1984);

graceful({
  servers: [server],
  killTimeout: '30s',
});
```

If you have multi servers on one process, you just add them to `server`:

```js
graceful({
  servers: [server1, server2, restapi],
  killTimeout: '15s',
});
```

### ESM and TypeScript

```ts
import { graceful } from 'graceful';
```

## Contributors

[![Contributors](https://contrib.rocks/image?repo=node-modules/graceful)](https://github.com/node-modules/graceful/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).

## License

[MIT](LICENSE)
