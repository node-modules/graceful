# connect with cluster and domain example

* Master: dispatch.js
* Worker: worker.js
* Your application logic: app.js

## Run

```bash
$ node example/connect_with_cluster/dispatch.js
```

## Test

curl asycerror twice:

```bash
$ curl localhost:1337/asycerror
domainThrown: true
ReferenceError: foo is not defined
    at Object._onTimeout (/Users/mk2/git/domain-middleware/example/connect_with_cluster/app.js:28:11)
    at Timer.list.ontimeout (timers.js:101:19)

$ curl localhost:1337/asycerror
domainThrown: true
ReferenceError: foo is not defined
    at Object._onTimeout (/Users/mk2/git/domain-middleware/example/connect_with_cluster/app.js:28:11)
    at Timer.list.ontimeout (timers.js:101:19)
```

[dispatch.js](https://github.com/fengmk2/domain-middleware/blob/master/example/connect_with_cluster/dispatch.js) stdout:

```bash
$ node example/connect_with_cluster/dispatch.js 
[Thu Apr 11 2013 18:45:36 GMT+0800 (CST)] [worker:21711] start listen on 1337
[Thu Apr 11 2013 18:45:36 GMT+0800 (CST)] [worker:21712] start listen on 1337
GET /asycerror
domainThrown: true
ReferenceError: foo is not defined
    at Object._onTimeout (/Users/mk2/git/domain-middleware/example/connect_with_cluster/app.js:28:11)
    at Timer.list.ontimeout (timers.js:101:19)
[Thu Apr 11 2013 18:45:47 GMT+0800 (CST)] [worker:21711] close server!
[Thu Apr 11 2013 18:45:47 GMT+0800 (CST)] [worker:21711] worker disconnect!
[Thu Apr 11 2013 18:45:47 GMT+0800 (CST)] [master:21710] wroker:21711 disconnect! new worker:21739 fork
[Thu Apr 11 2013 18:45:47 GMT+0800 (CST)] [worker:21739] start listen on 1337
GET /asycerror
domainThrown: true
ReferenceError: foo is not defined
    at Object._onTimeout (/Users/mk2/git/domain-middleware/example/connect_with_cluster/app.js:28:11)
    at Timer.list.ontimeout (timers.js:101:19)
[Thu Apr 11 2013 18:45:48 GMT+0800 (CST)] [worker:21739] close server!
[Thu Apr 11 2013 18:45:48 GMT+0800 (CST)] [worker:21739] worker disconnect!
[Thu Apr 11 2013 18:45:48 GMT+0800 (CST)] [master:21710] wroker:21739 disconnect! new worker:21749 fork
[Thu Apr 11 2013 18:45:48 GMT+0800 (CST)] [worker:21749] start listen on 1337
[Thu Apr 11 2013 18:45:50 GMT+0800 (CST)] [worker:21711] kill timeout, exit now.
[Thu Apr 11 2013 18:45:50 GMT+0800 (CST)] [master:21710] wroker:21711 exit!
[Thu Apr 11 2013 18:45:51 GMT+0800 (CST)] [worker:21739] kill timeout, exit now.
[Thu Apr 11 2013 18:45:51 GMT+0800 (CST)] [master:21710] wroker:21739 exit!
```