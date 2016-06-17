var m = require('mochainon');
var os = require('os');
var fs = require('fs');
var path = require('path');
var command = require('../lib/command');

describe('Command', function() {

  describe('.getBinaryPath()', function() {

    var isAbsolute = function(x) {
      return path.resolve(x) === x;
    };

    describe('given x86', function() {

      beforeEach(function() {
        this.osArchStub = m.sinon.stub(os, 'arch');
        this.osArchStub.returns('x64');
      });

      afterEach(function() {
        this.osArchStub.restore();
      });

      it('should return the path to the x64 executable', function() {
        var binPath = command.getBinaryPath();
        var expected = path.join(__dirname, '..', 'bin', 'elevate-x64.exe');
        m.chai.expect(binPath).to.equal(expected);
      });

      it('should return an absolute path', function() {
        var binPath = command.getBinaryPath();
        m.chai.expect(isAbsolute(binPath)).to.be.true;
      });

      it('should exist', function() {
        m.chai.expect(function() {
          fs.statSync(command.getBinaryPath());
        }).to.not.throw();
      });

    });

    describe('given ia32', function() {

      beforeEach(function() {
        this.osArchStub = m.sinon.stub(os, 'arch');
        this.osArchStub.returns('ia32');
      });

      afterEach(function() {
        this.osArchStub.restore();
      });

      it('should return the path to the ia32 executable', function() {
        var binPath = command.getBinaryPath();
        var expected = path.join(__dirname, '..', 'bin', 'elevate-ia32.exe');
        m.chai.expect(binPath).to.equal(expected);
      });

      it('should return an absolute path', function() {
        var binPath = command.getBinaryPath();
        m.chai.expect(isAbsolute(binPath)).to.be.true;
      });

      it('should exist', function() {
        m.chai.expect(function() {
          fs.statSync(command.getBinaryPath());
        }).to.not.throw();
      });

    });

    describe('given arm', function() {

      beforeEach(function() {
        this.osArchStub = m.sinon.stub(os, 'arch');
        this.osArchStub.returns('arm');
      });

      afterEach(function() {
        this.osArchStub.restore();
      });

      it('should throw a non supported error', function() {
        m.chai.expect(function() {
          command.getBinaryPath();
        }).to.throw('Unsupported arch: arm');
      });

    });

  });

  describe('.build()', function() {

    describe('given no command', function() {

      it('should throw an error', function() {
        m.chai.expect(function() {
          command.build(null);
        }).to.throw('Missing command');
      });

    });

    describe('given no options', function() {

      it('should return the correct command', function() {
        var result = command.build([ 'foo' ]);
        m.chai.expect(result).to.deep.equal([ 'foo' ]);
      });

    });

    describe('given terminating = true', function() {

      it('should return the correct command', function() {
        var result = command.build([ 'foo' ], {
          terminating: true
        });

        m.chai.expect(result).to.deep.equal([ '-c', 'foo' ]);
      });

    });

    describe('given terminating = true and a multiple word command', function() {

      it('should return the correct command', function() {
        var result = command.build([ 'foo', 'bar' ], {
          terminating: true
        });

        m.chai.expect(result).to.deep.equal([ '-c', 'foo', 'bar' ]);
      });

    });

    describe('given persistent = true', function() {

      it('should return the correct command', function() {
        var result = command.build([ 'foo' ], {
          persistent: true
        });

        m.chai.expect(result).to.deep.equal([ '-k', 'foo' ]);
      });

    });

    describe('given persistent = true and terminating = true', function() {

      it('should throw an error', function() {
        m.chai.expect(function() {
          command.build([ 'foo' ], {
            terminating: true,
            persistent: true
          });
        }).to.throw('Can\'t have a both persistent and terminating command processor');
      });

    });

    describe('given terminating = true and doNotPushdCurrentDirectory = true', function() {

      it('should return the correct command', function() {
        var result = command.build([ 'foo' ], {
          terminating: true,
          doNotPushdCurrentDirectory: true
        });

        m.chai.expect(result).to.deep.equal([ '-c', '-n', 'foo' ]);
      });

    });

    describe('given persistent = true and doNotPushdCurrentDirectory = true', function() {

      it('should return the correct command', function() {
        var result = command.build([ 'foo' ], {
          persistent: true,
          doNotPushdCurrentDirectory: true
        });

        m.chai.expect(result).to.deep.equal([ '-k', '-n', 'foo' ]);
      });

    });

    describe('given only doNotPushdCurrentDirectory = true', function() {

      it('should throw an error', function() {
        m.chai.expect(function() {
          command.build([ 'foo' ], {
            doNotPushdCurrentDirectory: true
          });
        }).to.throw('doNotPushdCurrentDirectory requires the terminating or persistent option');
      });

    });

    describe('given terminating = true and unicode = true', function() {

      it('should return the correct command', function() {
        var result = command.build([ 'foo' ], {
          terminating: true,
          unicode: true
        });

        m.chai.expect(result).to.deep.equal([ '-c', '-u', 'foo' ]);
      });

    });

    describe('given persistent = true and unicode = true', function() {

      it('should return the correct command', function() {
        var result = command.build([ 'foo' ], {
          persistent: true,
          unicode: true
        });

        m.chai.expect(result).to.deep.equal([ '-k', '-u', 'foo' ]);
      });

    });

    describe('given only unicode = true', function() {

      it('should throw an error', function() {
        m.chai.expect(function() {
          command.build([ 'foo' ], {
            unicode: true
          });
        }).to.throw('unicode requires the terminating or persistent option');
      });

    });

    describe('given waitForTermination = true', function() {

      it('should return the correct command', function() {
        var result = command.build([ 'foo' ], {
          waitForTermination: true
        });

        m.chai.expect(result).to.deep.equal([ '-w', 'foo' ]);
      });

    });

  });

});
