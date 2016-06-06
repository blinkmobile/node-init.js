'use strict';

const path = require('path')

const execa = require('execa')
const figures = require('figures')

const LABEL = 'npm package.json initialised'

function fn ({ cwd }) {
    return execa('npm', ['init', '-y'], { cwd })
        .then(() => console.log(`${LABEL}: ${figures.tick}`))
}

module.exports = {
    fn,
    label: LABEL
}