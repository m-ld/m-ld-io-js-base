// noinspection JSUnusedGlobalSymbols

import queueMicrotask from 'queue-microtask';

const pseudoProcess = {
  browser: true,
  nextTick(cb) {
    if (arguments.length > 1)
      queueMicrotask(() => cb.apply(null, [].slice.call(arguments, 1)))
    else
      queueMicrotask(cb);
  }
};
export { pseudoProcess as process };