'use strict';

var assert = require('assert');
var path = require('path');
var fork = require('child_process').fork;


describe('test/worker.test.js', () => {
  it('should kill all children', function (done) {
    var app = fork(path.join(__dirname, 'fixtures/ignore.js'));
    setTimeout(function() {
      assert(alive(app.pid));
    }, 1000);

    setTimeout(function () {
      assert(alive(app.pid));
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
