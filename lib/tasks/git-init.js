'use strict';

const path = require('path')

const execa = require('execa')
const figures = require('figures')

const fs = require('../fs.js')

const LABEL = 'git project exists'

function fn ({ cwd }) {
    return fs.access(path.join(cwd, '.git'))
        .catch(() => execa('git', ['init'], { cwd }))
        .then(() => console.log(`${LABEL}: ${figures.tick}`))
}

module.exports = {
    fn,
    label: LABEL
}