/**
 * Sets a global reference to jQuery inside `$`
 */
/* globals module */

var jQuery = require('jquery'); // jshint ignore:line

module.exports = function(virtualWindow, callback) {
    $ = jQuery(virtualWindow); // jshint ignore:line
    callback();
};
