/* globals describe, it, before, afterEach */

var async = require('async'),
    chai = require('chai'),
    assert = chai.assert,
    requirejs = require('requirejs');


var loadDependencies = function(callback) {
    requirejs(['util'], function(Util) {
        callback(null, Util);
    });
};

var Util;
/*
    Before performing any tests, loads the dependencies definition.
 */
before(function(done) {

    async.waterfall([
        loadDependencies
    ],
    function(err, dependencyDefinition) {
        if (err) {
            return done(err);
        } else {
            Util = dependencyDefinition;
            return done();
        }
    });
});

/**
 * Start test suite
 */
describe('util.js', function() {

    /**
     * Test the Util.sanitizeJson function
     */
    it('sanitizeJson cleans up a JS object correctly', function() {

        var originalObject = {
            l10n: [2, {
                real: 3,
                falseReal: []
            }],
            real: [123, 414],
            empty: null,
            subReal: {
                one: {},
                two: {
                    nine: 9
                },
                three: [],
                four: null,
                five: undefined,
                six: {
                    empty1: {},
                    empty2: [],
                    empty3: {
                        falsePositive: 0
                    }
                }
            }
        };

        Util.sanitizeJson(originalObject);

        var sanitizedObj = {
            l10n: [2, {
                real: 3
            }],
            real: [123, 414],
            subReal: {
                two: {
                    nine: 9
                },
                six: {
                    empty3: {
                        falsePositive: 0
                    }
                }
            }
        };
        // Makes sure the two objects are equal after being sanitized
        assert.strictEqual(JSON.stringify(originalObject), JSON.stringify(sanitizedObj), 'Final result is incorrect');

    });

});
