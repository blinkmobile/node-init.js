/* @flow */
'use strict';

const path = require('path');
const updateJsonFile = require('update-json-file');

const execa = require('execa');

const {
  addScript,
  getPkg,
  hasTestFramework,
  isTestScriptUnconfigured,
  removeScript
} = require('../pkg.js');
const { JSON_OPTIONS, PACKAGE_JSON } = require('../values.js');

const LABEL = 'tape installed and configured';

function npmInstall(cwd) {
  return execa('npm', ['install', '--save-dev', 'tape', 'tap', 'faucet'], { cwd });
}

function editPackageJson(cwd) {
  return updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      addScript(pkg, 'tape', 'find . -path ./node_modules -prune -o -type f -name ' *.test.js' -print0 | xargs -0 tape');
      addScript(pkg, 'test', 'npm run tape | faucet'); // `npm test` runs tape

      // remove unconfigured `npm test` provided by `npm init -y`
      removeScript(pkg, 'test', 'echo "Error: no test specified"');
      removeScript(pkg, 'test', 'exit 1');

      return pkg;
    },
    JSON_OPTIONS
  );
}

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return npmInstall(cwd).then(() => editPackageJson(cwd));
}

function isNeeded({ cwd } /* : TaskOptions */) {
  return getPkg(cwd).then(
    pkg =>
      !!(pkg.devDependencies || {}).jest ||
      (!hasTestFramework(pkg) && isTestScriptUnconfigured(pkg))
  );
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  requires: [PACKAGE_JSON]
};
