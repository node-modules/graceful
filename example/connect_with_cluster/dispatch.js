/*!
 * graceful - example/connect_with_cluster/dispatch.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

// http://nodejs.org/docs/latest/api/domain.html#domain_warning_don_t_ignore_errors
var cluster = require('cluster');
var path = require('path');

cluster.setupMaster({
  exec: path.join(__dirname, 'worker.js')
});

// In real life, you'd probably use more than just 2 workers,
// and perhaps not put the master and worker in the same file.
//
// You can also of course get a bit fancier about logging, and
// implement whatever custom logic you need to prevent DoS
// attacks and other bad behavior.
//
// See the options in the cluster documentation.
//
// The important thing is that the master does very little,
// increasing our resilience to unexpected errors.

cluster.fork();
cluster.fork();

// when worker disconnect, fork a new one
cluster.on('disconnect', function (worker) {
  var w = cluster.fork();
  console.error('[%s] [master:%s] wroker:%s disconnect! new worker:%s fork',
    new Date(), process.pid, worker.process.pid, w.process.pid);
});

// if you do not want every disconnect fork a new worker.
// you can listen worker's message.
// graceful will send `graceful:disconnect` message when disconnect.

// cluster.on('fork', function(worker) {
//   worker.on('message', function (msg) {
//     if (msg === 'graceful:disconnect') {
//       var w = cluster.fork();
//       console.error('[%s] [master:%s] wroker:%s disconnect! new worker:%s fork',
//       new Date(), process.pid, worker.process.pid, w.process.pid);
//     }
//   });
// });

cluster.on('exit', function (worker) {
  console.error('[%s] [master:%s] wroker:%s exit!',
    new Date(), process.pid, worker.process.pid);
});
