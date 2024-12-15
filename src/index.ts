import { Server } from 'node:http';
import cluster, { type Worker } from 'node:cluster';
import { debuglog } from 'node:util';
import { ms } from 'humanize-ms';
import { pstree } from '@fengmk2/ps-tree';

const debug = debuglog('graceful');

export interface GracefulOptions {
  /**
   * servers, we need to close it and stop taking new requests.
   */
  servers?: Server[] | Server;
  /**
   * @deprecated please use `servers` instead
   */
  server?: Server[] | Server;
  /**
   * worker suicide timeout, default is 30 seconds
   */
  killTimeout?: number | string;
  /**
   * when uncaughtException emit, error(err, count).
   * You can log error here.
   */
  error?: (err: Error, throwErrorCount: number) => void;
  /**
   * worker contains `disconnect()`
   */
  worker?: Worker;
  /**
   * ignore error code
   */
  ignoreCode?: number[];
}

/**
 * graceful, please use with `cluster` in production env.
 */
export function graceful(options: GracefulOptions) {
  const killTimeout = ms(options.killTimeout ?? '30s');
  const onError = options.error || function() {};
  let servers = options.servers ?? options.server ?? [];
  const ignoreCode = options.ignoreCode ?? [];
  if (!Array.isArray(servers)) {
    servers = [ servers ];
  }
  if (servers.length === 0) {
    throw new TypeError('options.servers required!');
  }

  let throwErrorCount = 0;
  process.on('uncaughtException', err => {
    throwErrorCount += 1;
    onError(err, throwErrorCount);
    console.error('[%s] [graceful:worker:%s:uncaughtException] throw error %d times',
      Date(), process.pid, throwErrorCount);
    console.error(err);
    console.error(err.stack);
    const errorCode = Reflect.get(err, 'code');
    if (ignoreCode.includes(errorCode)) {
      console.error('Error code: %s matches ignore list: %j, don\'t exit.', errorCode, ignoreCode);
      return;
    }

    if (throwErrorCount > 1) {
      return;
    }

    servers.forEach(server => {
      if (server instanceof Server) {
        server.on('request', (req, res) => {
          // Let http server set `Connection: close` header, and close the current request socket.
          // req.shouldKeepAlive = false;
          Reflect.set(req, 'shouldKeepAlive', false);
          res.shouldKeepAlive = false;
          if (!res.headersSent) {
            res.setHeader('Connection', 'close');
          }
        });
      }
    });

    // make sure we close down within `killTimeout` seconds
    const killTimer = setTimeout(async () => {
      console.error('[%s] [graceful:worker:%s] kill timeout, exit now. NODE_ENV: %s',
        Date(), process.pid, process.env.NODE_ENV);
      if (process.env.NODE_ENV !== 'test') {
        // kill children by SIGKILL before exit
        await killChildren();
        process.exit(1);
      }
    }, killTimeout);
    console.error('[%s] [graceful:worker:%s] will exit after %dms',
      Date(), process.pid, killTimeout);

    // But don't keep the process open just for that!
    // If there is no more io waiting, just let process exit normally.
    killTimer.unref();

    const worker = options.worker || cluster.worker;

    // cluster mode
    if (worker) {
      try {
        // stop taking new requests.
        // because server could already closed, need try catch the error: `Error: Not running`
        for (const [ i, server ] of servers.entries()) {
          server.close();
          console.error('[%s] [graceful:worker:%s] close server#%s, connections: %s',
            Date(), process.pid, i, server.connections);
        }
        console.error('[%s] [graceful:worker:%s] close %d servers!',
          Date(), process.pid, servers.length);
      } catch (err: any) {
        // Usually, this error throw cause by the active connections after the first domain error,
        // oh well, not much we can do at this point.
        console.error('[%s] [graceful:worker:%s] Error on server close!\n%s',
          Date(), process.pid, err.stack);
      }

      try {
        // Let the master know we're dead.  This will trigger a
        // 'disconnect' in the cluster master, and then it will fork
        // a new worker.
        worker.send('graceful:disconnect');
        worker.disconnect();
        console.error('[%s] [graceful:worker:%s] worker disconnect!',
          Date(), process.pid);
      } catch (err: any) {
        // Usually, this error throw cause by the active connections after the first domain error,
        // oh well, not much we can do at this point.
        console.error('[%s] [graceful:worker:%s] Error on worker disconnect!\n%s',
          Date(), process.pid, err.stack);
      }
    }
  });
}

async function killChildren() {
  try {
    const children = await pstree(process.pid);
    for (const child of children) {
      killProcess(parseInt(child.PID));
    }
    console.error('[%s] [graceful:worker:%s] pstree find %d children and killed',
      Date(), process.pid, children.length);
  } catch (err) {
    // if get children error, just ignore it
    console.error('[%s] [graceful:worker:%s] pstree find children error: %s',
      Date(), process.pid, err);
  }
}

function killProcess(pid: number) {
  try {
    process.kill(pid, 'SIGKILL');
  } catch (err) {
    // ignore
    debug('kill %s error: %s', pid, err);
  }
}
