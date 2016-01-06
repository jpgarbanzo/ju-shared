/**
 * This module it's used to override the reference to jquery
 * that's set in the front-end files that we need to test
 *
 * See the requirejs config inside `test/bootstrap` for more details
 */

/* globals module */

define([], function() {
    return $;
});
