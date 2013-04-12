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

var server = require('./app');
server.listen(PORT);
console.log('[%s] [worker:%s] start listen on %s', new Date(), process.pid, PORT);
