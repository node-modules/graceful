console.log('worker1 [%s] started', process.pid);

setTimeout(function() {
  console.log('worker1 alived');
}, 1000);

setInterval(function() {
  // keep alive
}, 100000);

process.on('SIGTERM', function() {
  console.log('worker1 on sigterm and not exit');
});
