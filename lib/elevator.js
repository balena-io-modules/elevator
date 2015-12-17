/*
 * The MIT License
 *
 * Copyright (c) 2015 Resin.io. https://resin.io
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @module elevator
 */

var child_process = require('child_process');
var commandBuilder = require('./command');

/**
 * @summary Execute a command with UAC elevation
 * @function
 * @public
 *
 * @param {String[]} command - command
 * @param {Object} [options={}] - options
 * @param {Boolean} [options.terminating] - Launches a terminating command processor; equivalent to "cmd /c command".
 * @param {Boolean} [options.persistent] - Launches a persistent command processor; equivalent to "cmd /k command".
 * @param {Boolean} [options.pushdCurrentDirectory] - When using -c or -k, do not pushd the current directory before execution.
 * @param {Boolean} [options.unicode] - When using -c or -k, use Unicode; equivalent to "cmd /u".
 * @param {Boolean} [options.waitForTermination] - Waits for termination; equivalent to "start /wait command".
 * @param {Function} callback - callback (error, stdout, stderr)
 *
 * @example
 * elevator.execute([ 'cmd.exe' ], {
 *   waitForTermination: true
 * }, function(error, stdout, stderr) {
 *   if (error) {
 *     throw error;
 *   }
 *
 *   console.log(stdout);
 *   console.log(stderr);
 * });
 */
exports.execute = function(command, options, callback) {
  child_process.execFile(commandBuilder.getBinaryPath(), commandBuilder.build(command, options), {
    encoding: 'utf8'
  }, callback);
};

/**
 * @summary Execute a command with UAC elevation (Sync)
 * @function
 * @public
 *
 * @param {String[]} command - command
 * @param {Object} [options={}] - options
 * @param {Boolean} [options.terminating] - Launches a terminating command processor; equivalent to "cmd /c command".
 * @param {Boolean} [options.persistent] - Launches a persistent command processor; equivalent to "cmd /k command".
 * @param {Boolean} [options.pushdCurrentDirectory] - When using -c or -k, do not pushd the current directory before execution.
 * @param {Boolean} [options.unicode] - When using -c or -k, use Unicode; equivalent to "cmd /u".
 * @param {Boolean} [options.waitForTermination] - Waits for termination; equivalent to "start /wait command".
 * @returns {String} stdout buffer
 *
 * @example
 * elevator.executeSync([ 'cmd.exe' ], {
 *   waitForTermination: true
 * });
 */
exports.executeSync = function(command, options) {
  child_process.execFileSync(commandBuilder.getBinaryPath(), commandBuilder.build(command, options), {
    encoding: 'utf8'
  });
};
