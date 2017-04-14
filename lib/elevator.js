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
var debug = require('debug')(require('../package.json').name);
var utils = require('./utils');

/**
 * @summary Execute a command with UAC elevation
 * @function
 * @public
 *
 * @description
 * This function will yield an `Error` containing a code that equals
 * `ELEVATE_CANCELLED` if the elevation was cancelled by the user.
 *
 * @param {String[]} command - command
 * @param {Object} [options={}] - options
 * @param {Boolean} [options.terminating] - Launches a terminating command processor; equivalent to "cmd /c command".
 * @param {Boolean} [options.persistent] - Launches a persistent command processor; equivalent to "cmd /k command".
 * @param {Boolean} [options.doNotPushdCurrentDirectory] - When using -c or -k, do not pushd the current directory before execution.
 * @param {Boolean} [options.unicode] - When using -c or -k, use Unicode; equivalent to "cmd /u".
 * @param {Boolean} [options.hidden] - When using -c or -k, start "cmd" in hidden mode.
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
  var binaryPath = commandBuilder.getBinaryPath();
  debug('executing: %s', binaryPath);

  child_process.execFile(binaryPath, commandBuilder.build(command, options), {
    encoding: 'utf8'
  }, function(error, stdout, stderr) {
    debug('stderr: %s', stderr);
    debug('stdout: %s', stdout);

    if (error) {
      if (utils.doesErrorMeansElevationWasCancelled(error)) {
        return callback.call(this, utils.ElevateCancelledError);
      }

      var elevationError = new Error('Couldn\'t elevate, exit code ' + error.code);
      elevationError.description = error.message;
      return callback(this, elevationError);
    }


    return callback.apply(this, arguments);
  });
};

/**
 * @summary Execute a command with UAC elevation (Sync)
 * @function
 * @public
 *
 * @description
 * This function will throw an `Error` containing a code that equals
 * `ELEVATE_CANCELLED` if the elevation was cancelled by the user.
 *
 * @param {String[]} command - command
 * @param {Object} [options={}] - options
 * @param {Boolean} [options.terminating] - Launches a terminating command processor; equivalent to "cmd /c command".
 * @param {Boolean} [options.persistent] - Launches a persistent command processor; equivalent to "cmd /k command".
 * @param {Boolean} [options.doNotPushdCurrentDirectory] - When using -c or -k, do not pushd the current directory before execution.
 * @param {Boolean} [options.unicode] - When using -c or -k, use Unicode; equivalent to "cmd /u".
 * @param {Boolean} [options.hidden] - When using -c or -k, start "cmd" in hidden mode.
 * @param {Boolean} [options.waitForTermination] - Waits for termination; equivalent to "start /wait command".
 * @returns {String} stdout buffer
 *
 * @example
 * elevator.executeSync([ 'cmd.exe' ], {
 *   waitForTermination: true
 * });
 */
exports.executeSync = function(command, options) {
  try {
    var binaryPath = commandBuilder.getBinaryPath();
    debug('executing: %s', binaryPath);

    return child_process.execFileSync(binaryPath, commandBuilder.build(command, options), {
      encoding: 'utf8'
    });
  } catch (error) {

    if (error.error && utils.doesErrorMeansElevationWasCancelled(error.error)) {
      throw utils.ElevateCancelledError;
    }

    throw error.error;
  }
};
