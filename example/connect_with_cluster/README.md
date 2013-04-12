# connect with cluster example

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

$ curl localhost:1337/asycerror

```

[dispatch.js](https://github.com/fengmk2/graceful/blob/master/example/connect_with_cluster/dispatch.js) stdout:

```bash
$ node example/connect_with_cluster/dispatch.js 
[Thu Apr 11 2013 18:45:36 GMT+0800 (CST)] [worker:21711] start listen on 1337
[Thu Apr 11 2013 18:45:36 GMT+0800 (CST)] [worker:21712] start listen on 1337
[uncaughtException] throw error 1 times
[ReferenceError: foo is not defined]
[Fri Apr 12 2013 18:11:34 GMT+0800 (CST)] [worker:52207] close server!
[Fri Apr 12 2013 18:11:34 GMT+0800 (CST)] [worker:52207] worker disconnect!
[Fri Apr 12 2013 18:11:34 GMT+0800 (CST)] [master:52205] wroker:52207 disconnect! new worker:52317 fork
[Fri Apr 12 2013 18:11:34 GMT+0800 (CST)] [worker:52317] start listen on 1337
[uncaughtException] throw error 1 times
[ReferenceError: foo is not defined]
[Fri Apr 12 2013 18:11:35 GMT+0800 (CST)] [worker:52206] close server!
[Fri Apr 12 2013 18:11:35 GMT+0800 (CST)] [worker:52206] worker disconnect!
[Fri Apr 12 2013 18:11:35 GMT+0800 (CST)] [master:52205] wroker:52206 disconnect! new worker:52328 fork
[Fri Apr 12 2013 18:11:35 GMT+0800 (CST)] [worker:52328] start listen on 1337
[Fri Apr 12 2013 18:11:37 GMT+0800 (CST)] [worker:52207] kill timeout, exit now.
[Fri Apr 12 2013 18:11:37 GMT+0800 (CST)] [master:52205] wroker:52207 exit!
```