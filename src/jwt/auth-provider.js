/**                   _
 *  _             _ _| |_
 * | |           | |_   _|
 * | |___  _   _ | | |_|
 * | '_  \| | | || | | |
 * | | | || |_| || | | |
 * |_| |_|\___,_||_| |_|
 *
 * (c) Huli Inc
 */


/**
 * @file Manage the authentication token
 * @description Manage the authentication token(CRUD operations), sign requests and triggers an event when the token is updated
 * @requires jquery
 * @requires ju-shared/observable-class
 * @requires ju-shared/jwt/token
 * @requires ju-shared/web-storage
 * @module ju-shared/jwt/auth-provider
 * @extends ju-shared/observable-class
 * @fires module:ju-shared/jwt/auth-provider#TOKEN_UPDATED
 * @listens ju-shared/web-storage#storageEvent
 */

define([
        'jquery',
        'ju-shared/observable-class',
        'ju-shared/jwt/token',
        'ju-shared/web-storage'
    ],
    function (
        $,
        ObservableClass,
        JWTToken,
        WebStorage
    ){
        'use strict';


        /** Constants **/

        var ERROR_INVALID_TOKEN = "Token invalid";


        var AuthProvider = ObservableClass.extend({

            /**
             * @constructor
             * @alias module:ju-shared/jwt/auth-provider
             * @param {Object} opts - configuration
             * @param {String} opts.appKey - App key used to validate and request tokens
             * @param {String} opts.redirectURL - the app will be redirected to this URL if the token is invalid
             */
            init : function (opts) {
                this.webStorage = new WebStorage();
                this.appKey = opts.appKey || AuthProvider.opts.appKey;
                this.redirectURL = opts.redirectURL || AuthProvider.redirectURL;
                // JWT options needed to create and validate a token
                this.jwtOptions = {
                    audience: this.appKey
                };
                this.accessToken = this.loadToken();
                this.webStorage.on(WebStorage.EV.STORAGE_EVENT, $.proxy(this.refreshTokenHandler,this));
            },

            /**
             * Load the token value from the source(1.local storage | 2. cookie)
             * @returns {*|token} JWTToken
             */
            loadToken : function () {
                return new JWTToken(this.webStorage.getItem(AuthProvider.WEB_STORAGE_KEY_ACCESS_TOKEN), this.jwtOptions);
            },

            /**
             * Sets and stores the token on local storage
             * @param token {String} - JWT token
             */
            updateToken : function (token) {
                this.accessToken =  new JWTToken(token, this.jwtOptions);
                var jwtToken = this.accessToken ?  this.accessToken.getToken() : null;
                this.webStorage.setItem(AuthProvider.WEB_STORAGE_KEY_ACCESS_TOKEN, jwtToken);
                this.trigger(AuthProvider.EV.TOKEN_UPDATED);
            },

            /**
             * Add the auth header to the request
             * @param {Function} ajaxCallback  - callback function
             * @param {Object} params  - ajax params
             * @param {Boolean} [params.useJWTAuthentication=true]  - indicates if should use JWT tokens on the request
             */
            signRequest : function (ajaxCallback, params) {
                var useJWTAuthentication = (params && params.useJWTAuthentication === false) ? false : true;
                if (useJWTAuthentication) {
                    var headers = params.headers || {};
                    headers[AuthProvider.HEADER_AUTHORIZATION] = 'Bearer ' + this.accessToken.getToken();
                    params.headers = headers;
                }
                ajaxCallback(params);
            },

            /**
             * Get the expiration time
             * @returns {Number} returns -1 if there is not token
             */
            getExpirationTime : function () {
                return this.accessToken ? this.accessToken.getExpirationTime() : -1;
            },

            /**
             * Checks if the current token is valid
             * @returns {Boolean}
             */
            isTokenValid : function () {
                return this.accessToken && this.accessToken.isValid();
            },

            /**
             * Handle the event when the token is updated in other tab or window
             * @param {StorageEvent} event
             * @see https://developer.mozilla.org/en-US/docs/Web/Events/storage
             */
            refreshTokenHandler : function(event){
                if (event && event.key === AuthProvider.WEB_STORAGE_KEY_ACCESS_TOKEN){
                    log('AuthProvider: Token Updated in localStorage, reloading token in memory');
                    this.accessToken = this.loadToken();
                    this.trigger(AuthProvider.EV.TOKEN_UPDATED);
                }
            },

            /**
             * Returns a middleware object to handle the auth
             * @returns {Object}
             */
            getMiddleware  : function () {
                var _self = this;
                var Middleware = {};

                /**
                 * Defines and returns a promise that validates the authentication
                 * @param {Object }controllerInfo - controller/route information
                 * @returns {Promise}
                 */
               Middleware.run = function (controllerInfo) {
                    return new Promise(function(resolve, reject) {
                        if (!controllerInfo.needAuthentication || (controllerInfo.needAuthentication && _self.isTokenValid())) {
                            resolve(true);
                        }
                        else {
                            reject(new Error(ERROR_INVALID_TOKEN));
                        }
                    });
                };


                /**
                 * Redirects to opts.redirectURL when the authentication fails
                 * @param {Error}
                 */
                Middleware.errorHandler = function (error) {
                    log('AuthProvider: Error handled, token invalid, redirect to login page '+ _self.redirectURL);
                    window.location.href = _self.redirectURL;
                    throw error;
                };

                return Middleware;
            }
        });


        AuthProvider.classMembers({
            /**
             * @constant {String} HEADER_AUTHORIZATION - custom request header, it will store the auth token
             */
            HEADER_AUTHORIZATION : 'authorization',

            /**
             * @constant {String} WEB_STORAGE_KEY_ACCESS_TOKEN - Web storage key for the access token, it will store the token
             */
            WEB_STORAGE_KEY_ACCESS_TOKEN : 'access_token',


            EV : {
                /**
                 * Event triggered when the token is updated
                 * @event module:ju-shared/jwt/auth-provider#TOKEN_UPDATED
                 */
                TOKEN_UPDATED: 'access_token_updated'
            },

            opts : {
                redirectURL : '/'
            },

            configure : function(opts) {
                $.extend(true, AuthProvider.opts, opts);
            }
        });

        // Exports
        return AuthProvider;
});