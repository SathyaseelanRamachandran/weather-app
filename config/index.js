'use strict'

// import the default configuration

const defaults = require('./default.js');

// if the server starts in a specific environment, use that
// otherwise use the 'development' by default

const configEnv = process.env.NODE_ENV || 'development';

// construct the path to the config module
// what if 'process.env.NODE_ENV' !== 'production'

const configPath = `./${configEnv}.js`;

// import a config module based on the constructed path

const config =  require(configPath);

// merge the imported with the defaults
// to form the final config

module.exports = Object.assign({}, defaults, config);
