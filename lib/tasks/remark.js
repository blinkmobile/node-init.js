/* @flow */
'use strict';

const path = require('path');
const updateJsonFile = require('update-json-file');

const execa = require('execa');

const {
  addScript,
  getPkg
} = require('../pkg.js');
const { PACKAGE_JSON } = require('../values.js');

const LABEL = 'remark installed and configured';

function npmInstall(cwd) {
  return execa('npm', ['install', '--save-dev', 'remark-cli', 'remark-lint', 'remark-preset-lint-recommended'], { cwd });
}

function editPackageJson(cwd) {
  return updateJsonFile(
    path.join(cwd, 'package.json'),
    pkg => {
      addScript(pkg, 'remark', 'remark . --use remark-preset-lint-recommended');
      // call remark from "pretest", because `--fix` may change files
      addScript(pkg, 'pretest', 'npm run remark');
      return pkg;
    }
  );
}

/* :: import type { TaskOptions } from '../types.js' */

function fn({ cwd } /* : TaskOptions */) {
  return npmInstall(cwd).then(() => editPackageJson(cwd));
}

function isNeeded({ cwd } /* : TaskOptions */) {
  return getPkg(cwd);
}

module.exports = {
  fn,
  id: path.basename(__filename),
  isNeeded,
  label: LABEL,
  requires: [PACKAGE_JSON]
};
