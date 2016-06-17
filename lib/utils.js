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
 * @summary The string printed by `elevate.exe` when the elevation is cancelled
 * @constant
 * @type {String}
 * @protected
 *
 * @description
 * This constant is exported for testability reasons.
 */
exports.ELEVATE_EXE_CANCELLED_MESSAGE = 'The operation was canceled by the user';

/**
 * @summary Check if an error message represents an elevation cancellation condition
 * @public
 * @function
 *
 * @param {Error} error - error object
 * @returns {Boolean} whether the error is a cancellation error
 *
 * @example
 * if (utils.doesErrorMeansElevationWasCancelled(error)) {
 *   console.log('The error means that the user cancelled the elevation request');
 * }
 */
exports.doesErrorMeansElevationWasCancelled = function(error) {
  return error.message.indexOf(exports.ELEVATE_EXE_CANCELLED_MESSAGE) !== -1;
};

/**
 * @summary An extended elevation cancelled Error object
 * @constant
 * @type {Error}
 * @public
 */
exports.ElevateCancelledError = new Error(exports.ELEVATE_EXE_CANCELLED_MESSAGE);
exports.ElevateCancelledError.code = 'ELEVATE_CANCELLED';
