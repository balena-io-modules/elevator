var m = require('mochainon');
var utils = require('../lib/utils');

describe('Utils', function() {

  describe('.doesErrorMeansElevationWasCancelled()', function() {

    it('should return true if the error message contains the elevation string', function() {
      var error = new Error('foo ' + utils.ELEVATE_EXE_CANCELLED_MESSAGE + ' bar');
      m.chai.expect(utils.doesErrorMeansElevationWasCancelled(error)).to.be.true;
    });

    it('should return false if the error message does not contain the elevation string', function() {
      var error = new Error('foo bar');
      m.chai.expect(utils.doesErrorMeansElevationWasCancelled(error)).to.be.false;
    });

    it('should return true if the error message contains the elevation string after a new line', function() {
      var error = new Error([
        'foo',
        utils.ELEVATE_EXE_CANCELLED_MESSAGE,
        'bar'
      ].join('\n'));

      m.chai.expect(utils.doesErrorMeansElevationWasCancelled(error)).to.be.true;
    });

  });

  describe('.ElevateCancelledError', function() {

    it('should be an instance of Error', function() {
      m.chai.expect(utils.ElevateCancelledError).to.be.an.instanceof(Error);
    });

    it('should have an error code that equals ELEVATE_CANCELLED', function() {
      m.chai.expect(utils.ElevateCancelledError.code).to.equal('ELEVATE_CANCELLED');
    });

  });

});
