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
 * @file Handles the authentication flow with the Auth server.
 * @description In charge of requesting access tokens.
 * Refresh the access token when the access token expired.
 * Add the token to the Authorization header.
 * @requires jquery
 * @requires ju-shared/observable-class
 * @requires ju-shared/jwt/token
 * @requires ju-shared/web-storage
 * @module ju-shared/auth-provider
 * @extends ju-shared/observable-class
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


        var AuthProvider = ObservableClass.extend({

            /***
             *
             * @param {Object} opts - configuration
             * @param {String} opts.APP_KEY - application id
             */
            init : function (opts) {
                this.webStorage = new WebStorage();
                this.opts = opts || AuthProvider.opts;
                /** JWT options needed to create and validate a token*/
                this.jwtOptions = {
                    audience: this.opts.APP_KEY
                };
                /**
                 * JWTToken
                 * @member token {?Object}
                 * @default null
                 * @see module:ju-shared/jwt/token
                 */
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

            /***
             * Checks if the current token is valid
             * @returns {Boolean}
             */
            isTokenValid : function () {
                return this.accessToken && this.accessToken.isValid();
            },

            /***
             * Handle the event when the token is updated in other tab or window
             * @param {StorageEvent} event
             * @see https://developer.mozilla.org/en-US/docs/Web/Events/storage
             */
            refreshTokenHandler : function(event){
                if (event && event.key === AuthProvider.WEB_STORAGE_KEY_ACCESS_TOKEN){
                    log('new access token, updated in other tab');
                    this.accessToken = this.loadToken();
                }
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

            opts : {},

            configure : function(opts) {
               AuthProvider.opts = opts;
            }
        });

        // Exports
        return AuthProvider;
});