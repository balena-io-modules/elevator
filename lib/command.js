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

var os = require('os');
var _ = require('lodash');
var path = require('path');
var binPath = path.join(__dirname, '..', 'bin');

/**
 * @summary Get elevate.exe binary path
 * @function
 * @public
 *
 * @returns {String} path to elevate.exe
 *
 * @throws Will throw if the architecture is not supported.
 *
 * @example
 * var path = command.getBinaryPath();
 */
exports.getBinaryPath = function() {
  var arch = os.arch();

  if (arch !== 'x64' && arch !== 'ia32') {
    throw new Error('Unsupported arch: ' + arch);
  }

  return path.join(binPath, 'elevate-' + arch + '.exe');
};

/*
 * @summary Build command arguments
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
 *
 * @returns {String} command arguments
 *
 * @example
 * var args = command.build([ 'foo.exe' ], {
 *   terminating: true,
 *   unicode: true
 * });
 */
exports.build = function(command, options) {
  if (!command) {
    throw new Error('Missing command');
  }

  options = options || {};

  if (options.terminating && options.persistent) {
    throw new Error('Can\'t have a both persistent and terminating command processor');
  }

  if (options.pushdCurrentDirectory && !options.terminating && !options.persistent) {
    throw new Error('pushdCurrentDirectory requires the terminating or persistent option');
  }

  if (options.unicode && !options.terminating && !options.persistent) {
    throw new Error('unicode requires the terminating or persistent option');
  }

  var args = [];

  if (options.terminating) {
    args.push('-c');
  }

  if (options.persistent) {
    args.push('-k');
  }

  if (options.pushdCurrentDirectory) {
    args.push('-n');
  }

  if (options.unicode) {
    args.push('-u');
  }

  if (options.waitForTermination) {
    args.push('-w');
  }

  return args.concat(command);
};
