// noinspection JSUnusedGlobalSymbols

const resolve = require('resolve/sync');

/**
 * @param {string[]} shims any wanted core module with a shim in this project.
 * @param {string[]} [envVars] environment variables to substitute in the output
 * @returns {import('esbuild').Plugin}
 */
exports.resolveNode = function (shims, envVars) {
  return {
    name: 'resolve-nodejs',
    setup({ onResolve, initialOptions }) {
      for (let shim of shims) {
        const shimPath = resolve(shim, { includeCoreModules: false });
        const filter = new RegExp(`^${shim}$`);
        onResolve({ filter }, () => ({ path: shimPath }));
      }
      initialOptions.inject ??= [];
      initialOptions.inject.push(resolve('./inject/global'));
      initialOptions.inject.push(resolve('./inject/process'));
      if (shims.includes('buffer'))
        initialOptions.inject.push(resolve('./inject/Buffer'));
      if (envVars != null) {
        Object.assign(initialOptions.define ??= {}, Object.fromEntries(
          envVars.map(envVar => [
            `process.env.${envVar}`, JSON.stringify(process.env[envVar])
          ])
        ));
      }
    }
  };
};