import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fork } from 'node:child_process';
import { pstree } from '@fengmk2/ps-tree';
import mm from 'mm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('test/worker.test.ts', () => {
  afterEach(mm.restore);

  it('should kill all children', done => {
    mm(process.env, 'NODE_ENV', 'prod');
    const app = fork(path.join(__dirname, 'fixtures/app.cjs'));
    let workerPid: string;
    setTimeout(() => {
      assert(alive(app.pid!), 'app.pid should alive');
      pstree(app.pid!, (err, children) => {
        if (err) {
          return done(err);
        }
        assert(children);
        assert.equal(children.length, 1);
        workerPid = children[0].PID;
      });
    }, 1000);

    setTimeout(() => {
      assert(!alive(app.pid!), 'app.pid should not alive');
      assert(!alive(Number(workerPid)), 'workerPid should not alive');
      done();
    }, 4000);
  });
});

function alive(pid: number) {
  try {
    process.kill(pid, 0);
    console.warn('%s alive', pid);
    return true;
  } catch (err) {
    console.error('kill %s error: %s', pid, err);
    return false;
  }
}
