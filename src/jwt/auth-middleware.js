/**                   _
 *  _             _ _| |_
 * | |           | |_   _|
 * | |___  _   _ | | |_|
 * | '_  \| | | || | | |
 * | | | || |_| || | | |
 * |_| |_|\___,_||_| |_|
 *
 * (c) Huli Inc
 */// jscs:ignore disallowMultipleLineBreaks


/**
 * @file Handles the authentication in the middleware route phase
 * @description Manage the authentication when a route changed, implements the necessary middleware functions
 * @requires ju-shared/class
 * @requires ju-shared/jwt/auth-provider
 * @module ju-shared/jwt/auth-middleware
 */

define([
        'ju-shared/class',
        'ju-shared/jwt/auth-provider'
    ],
    function(
        Class,
        AuthProvider
    ) {
        'use strict';

        var Middleware = Class.extend({
            /**
             * @constructor
             * @alias module:ju-shared/jwt/auth-middleware
             * @param {Object} opts - configuration
             * @param {String} opts.redirectURL - the app will be redirected to this URL if the token is invalid
             */
            init : function(opts) {
                this.redirectURL = opts && opts.redirectURL ? opts.redirectURL : Middleware.opts.redirectURL;
                this.authProvider = AuthProvider.getInst();
            },

            /**
             * Defines and returns a promise that validates the authentication
             * @param {Object} controllerInfo - controller/route information
             * @returns {Promise}
             */
            run : function(controllerInfo) {
                var self = this;
                return new Promise(function(resolve, reject) {
                    if (controllerInfo.skipAuthentication) {
                        resolve(true);
                    } else if (self.authProvider.isTokenValid()) {
                        resolve(true);
                    } else {
                        reject(new Error(AuthProvider.ERROR_INVALID_TOKEN));
                    }
                });
            },

            /**
             * Redirects to opts.redirectURL when the authentication fails
             * @param {Error} error
             */
            errorHandler : function(error) {
                log('AuthMiddleware: Error handled, token invalid, redirect to login page ' + this.redirectURL);
                window.location.href = this.redirectURL;
                throw error;
            }
    });

    Middleware.classMembers({

        opts : {
            redirectURL : '/'
        }

    });

    // Exports
    return Middleware;
});
