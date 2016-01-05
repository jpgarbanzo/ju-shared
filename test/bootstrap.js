/* globals before, __dirname */
var requirejs = require('requirejs');

/*
    before any of the tests:
    - configure requirejs
 */
before(function(done) {
    requirejs.config({
        baseUrl : __dirname + '/../',
        paths : {
            'ju-shared' : __dirname + '/../'
        }
    });

    done();
});
