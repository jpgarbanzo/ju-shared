/**
 * Sets a global reference to window inside `window`
 */
/* globals module */

var jsdom = require('jsdom');

var createGlobalWindowObject = function(callback, err, jsdomWindow) {
    window = jsdomWindow;
    callback(err, jsdomWindow);
};

module.exports = function(callback) {
    jsdom.env({
        done : createGlobalWindowObject.bind(null, callback),
        html : '<body></body>'
    });
};
