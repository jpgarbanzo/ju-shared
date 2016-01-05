/* globals describe, it, before */

var async = require('async'),
    chai = require('chai'),
    expect = chai.expect,
    jsdom = require('jsdom'),
    requirejs = require('requirejs');

var createDomEnvironment = function(callback) {
    jsdom.env({
        done : callback,
        html : '<body></body>'
    });
};

var bootstrapProxyDefinition = function(jsdomWindow, callback) {
    // @NOTICE this is required to prevent not defined 'window' warning
    //         and must happen before loading the BaseProxy definition
    window = jsdomWindow; // jshint ignore:line

    requirejs(['base-proxy'], function(BaseProxy) {
        callback(null, BaseProxy);
    });
};

var BaseProxy;
/*
    Before performing any tests, loads the BaseProxy definition, that's because
    loading it inside every case will cause some of the Chai errors to not be
    properly caught by mocha

    Also, obtains a reference to `window` object to prevent warnings to appear
 */
before(function(done) {

    async.waterfall([
        createDomEnvironment,
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

});
