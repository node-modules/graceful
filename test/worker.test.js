'use strict';

var assert = require('assert');
var path = require('path');
var fork = require('child_process').fork;
var pstree = require('ps-tree');


describe('test/worker.test.js', () => {
  it('should kill all children', function (done) {
    var app = fork(path.join(__dirname, 'fixtures/app.js'));
    var workerPid;
    setTimeout(function() {
      assert(alive(app.pid));
      pstree(app.pid, function (_, children) {
        assert(children.length === 1);
        workerPid = children[0].PID;
      });
    }, 1000);

    setTimeout(function () {
      assert(!alive(app.pid));
      assert(!alive(workerPid));
      done();
    }, 4000);
  });
});

function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return false;
  }
}
