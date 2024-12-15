import { strict as assert } from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fork } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('test/ignore.test.ts', () => {
  it('should kill all children', function(done) {
    const app = fork(path.join(__dirname, 'fixtures/ignore.cjs'));
    setTimeout(function() {
      assert(alive(app.pid!));
    }, 1000);

    setTimeout(function() {
      assert(alive(app.pid!));
      done();
    }, 4000);
  });
});

function alive(pid: number) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return false;
  }
}
