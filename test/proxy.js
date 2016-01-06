/* globals describe, it, before */

var async = require('async'),
    chai = require('chai'),
    expect = chai.expect,
    requirejs = require('requirejs'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

// config and bootstrap
sinon.assert.expose(chai.assert, { prefix: '' });
chai.use(sinonChai);

var bootstrapProxyDefinition = function(callback) {
    // @NOTICE this is required to prevent not defined 'window' warning
    //         and must happen before loading the BaseProxy definition

    requirejs(['base-proxy'], function(BaseProxy) {
        callback(null, BaseProxy);
    });
};

var BaseProxy;
/*
    Before performing any tests, loads the BaseProxy definition, that's because
    loading it inside every case will cause some of the chai errors to not be
    properly caught by mocha
 */
before(function(done) {

    async.waterfall([
        bootstrapProxyDefinition
    ],
    function(err, proxyDefinition) {
        if (err) {
            return done(err);
        } else {
            BaseProxy = proxyDefinition;
            return done();
        }
    });
});

describe('HTTP Proxy', function() {

    it('Includes makeAjaxRequest in its API', function() {
        expect(BaseProxy).to.be.a('function');
        expect(BaseProxy.getInst().makeAjaxRequest).to.be.a('function');
        return true;
    });

    it('Performs an AJAX request', function(done) {
        sinon.stub($, 'ajax')
            .yieldsTo('success', {
                data : 'dummy-response'
            });

        var proxy = new BaseProxy(),
            successHandler = function() {
                done();
            };
            // successHandler = sinon.spy();

        proxy.makeAjaxRequest({
            url : BaseProxy.EP.API_PREFIX + 'test',
            success : successHandler,
            error : successHandler
        });

        // expect(successHandler).to.have.been.calledWithMatch({
        //     url : '/api/test',
        //     dataType: 'json'
        // });
    });

});
