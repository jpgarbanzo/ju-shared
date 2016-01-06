/* globals before, __dirname */
var async = require('async'),
    createGlobalWindow = require('./common/global-definitions/window.js'),
    createGlobalJquery = require('./common/global-definitions/jquery.js'),
    requirejs = require('requirejs');

/*
    Before performing any tests, configures requirejs
    and makes sure to point to the proper `jquery` reference (the one with DOM set)
 */
var bootstrap = function(done, err) {
        if (err) {
            return done(err);
        } else {
            requirejs.config({
                baseUrl : __dirname + '/../',
                paths : {
                    'ju-shared' : __dirname + '/../',
                    // override to the jquery path defined in frontend
                    // this file returns a proper jQuery def (with a dom set)
                    // for node.js
                    jquery : __dirname + '/common/global-definitions/jquery-getter'
                }
            });

            return done();
        }
};

before(function(done) {
    async.waterfall([
        createGlobalWindow,
        createGlobalJquery
    ],
    bootstrap.bind(this, done)
    );
});
