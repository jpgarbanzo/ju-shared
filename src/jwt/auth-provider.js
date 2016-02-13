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
    function(
        $,
        ObservableClass,
        JWTToken,
        WebStorage
    ) {
        'use strict';

        var AuthProvider = ObservableClass.extend({

            /**
             * @constructor
             * @alias module:ju-shared/jwt/auth-provider
             * @param {Object} opts - configuration
             * @param {String} opts.appKey - App key used to validate and request tokens
             */
            init : function(opts) {
                opts = opts || {};
                this.webStorage = new WebStorage().listenStorageEvents();
                this.appKey = opts.appKey || AuthProvider.opts.appKey;
                // JWT options needed to create and validate a token
                this.jwtOptions = {
                    audience : this.appKey
                };
                this.accessToken = this.loadToken();
                this.webStorage.on(WebStorage.EV.STORAGE_EVENT, $.proxy(this.refreshTokenHandler,this));
            },

            /**
             * Load the token value from the source(1.local storage | 2. cookie)
             * @returns {*|token} JWTToken
             */
            loadToken : function() {
                return new JWTToken(this.webStorage.getItem(AuthProvider.WEB_STORAGE_KEY_ACCESS_TOKEN), this.jwtOptions);
            },

            /**
             * Sets and stores the token on local storage
             * @param token {String} - JWT token
             */
            updateToken : function(token) {
                this.accessToken = new JWTToken(token, this.jwtOptions);
                var jwtToken = this.accessToken ? this.accessToken.getToken() : null;
                this.webStorage.setItem(AuthProvider.WEB_STORAGE_KEY_ACCESS_TOKEN, jwtToken);
                this.trigger(AuthProvider.EV.TOKEN_UPDATED);
            },

            /**
             * Add the auth header to the request
             * @param {Function} ajaxCallback  - callback function
             * @param {Object} params  - ajax params
             * @param {Boolean} [params.useJWTAuthentication=true]  - indicates if should use JWT tokens on the request
             */
            signRequest : function(ajaxCallback, params) {
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
            getExpirationTime : function() {
                return this.accessToken ? this.accessToken.getExpirationTime() : -1;
            },

            /**
             * Checks if the current token is valid
             * @returns {Boolean}
             */
            isTokenValid : function() {
                return this.accessToken && this.accessToken.isValid();
            },

            /**
             * Handle the event when the token is updated in other tab or window
             * @param {StorageEvent} event
             * @see https://developer.mozilla.org/en-US/docs/Web/Events/storage
             */
            refreshTokenHandler : function(event) {
                if (event && event.key === AuthProvider.WEB_STORAGE_KEY_ACCESS_TOKEN) {
                    log('AuthProvider: Token Updated in localStorage, reloading token in memory');
                    this.accessToken = this.loadToken();
                    this.trigger(AuthProvider.EV.TOKEN_UPDATED);
                }
            },

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

            /**
             * @constant {String} ERROR_INVALID_TOKEN - Invalid token message
             */
            ERROR_INVALID_TOKEN : 'Token invalid',

            EV : {
                /**
                 * Event triggered when the token is updated
                 * @event module:ju-shared/jwt/auth-provider#TOKEN_UPDATED
                 */
                TOKEN_UPDATED : 'access_token_updated'
            },

            opts : {
            },

            configure : function(opts) {
                $.extend(true, AuthProvider.opts, opts);
            }
        });

        // Exports
        return AuthProvider;
});
