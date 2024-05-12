export type SemaphoreFn<T = unknown> = () => Promise<T>;

export class Semaphore {
  // eslint-disable-next-line @typescript-eslint/ban-types
  private queue: SemaphoreFn[] = [];

  constructor(private count: number = 10) {}

  acquire() {
    return new Promise<() => void>((resolve, _reject) => {
      const task = async () => {
        let released = false;
        resolve(() => {
          if (!released) {
            released = true;
            this.count--;
            this.scheduleNext();
          }
        });
      };
      this.queue.push(task);
      if (process && process.nextTick) {
        process.nextTick(this.scheduleNext.bind(this));
      } else {
        setImmediate(this.scheduleNext.bind(this));
      }
    });
  }

  use<T>(fn: SemaphoreFn<T>) {
    return this.acquire().then((release) => {
      return fn()
        .then((res) => {
          release();
          return res;
        })
        .catch((err) => {
          release();
          throw err;
        });
    });
  }

  private scheduleNext() {
    if (this.count > 0 && this.queue.length > 0) {
      this.count++;
      const next = this.queue.shift();
      if (next == null) {
        throw new Error('Undefined function in semaphore');
      }

      next();
    }
  }
}
