/**                   _
 *  _             _ _| |_
 * | |           | |_   _|
 * | |___  _   _ | | |_|
 * | '_  \| | | || | | |
 * | | | || |_| || | | |
 * |_| |_|\___,_||_| |_|
 *`
 * (c) Huli Inc
 */

/**
 * @file Make requests to the auth server
 * @description Handles the login, logout and refreshToken requests
 * @requires jquery
 * @requires ju-shared/base-proxy
 * @requires ju-shared/jwt/auth-provider
 * @module ju-shared/jwt
 * @extends ju-shared/observable-class
 */


define([
            'jquery',
            'ju-shared/base-proxy',
            'ju-shared/jwt/auth-provider'
        ],
        function(
                    $,
                    BaseProxy,
                    AuthProvider
                )
{
    'use strict';

    var AuthProxy = BaseProxy.extend({

        /**
         * @param {String} opts.APP_KEY - The consumer ID key
         * @param {String} opts.EP.LOGIN - the login URL endpoint
         * @param {String} opts.EP.LOGOUT - the logout URL endpoint
         * @param {String} opts.EP.REFRESH_TOKEN - the refreshToken URL endpoint
         * @see https://github.com/hulilabs/portunus#headers
         */
        init : function (opts) {
            this._super.call(this, opts);
        },


        /**
         * Login request
         * @param {Object} params
         * @param {String} params.email - email address
         * @param {String} params.password - user password
         * @param {Function} successCallback
         * @param {Function} errorCallback
         * @see https://github.com/hulilabs/portunus#post-login
         */
        login : function (params, successCallback, errorCallback) {
            var ajaxParams = {
                headers : {
                    APP_KEY : this.opts.APP_KEY || BaseProxy.opts.APP_KEY
                },
                contentType : 'application/x-www-form-urlencoded',
                data : params,
                url : this.EP.LOGIN,
                useJWTAuthentication : false,
                type: 'POST',
                success : function (result, textStatus, request) {
                    this._loginSuccess(result, textStatus, request, successCallback);
                },
                error : function (request, textStatus, error) {
                    this._loginError(request, textStatus, error, errorCallback);
                }
            };
            this.makeAjaxRequest(ajaxParams);
        },

        /**
         * this function is executed when the login is successful, it saves the provided token.
         * @param {Anything} result
         * @param {String} textStatus
         * @param {jqXHR} request
         * @param {Function} callback
         * @private
         * @see http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings
         */
        _loginSuccess : function (result, textStatus, request, callback) {
            var authProvider = AuthProvider.getInst();
            var token = result.data ? result.data.jwt : null;
            /** Update the localStorage with the returned token **/
            authProvider.updateToken(token);
            callback(result, textStatus, request);
        },

        /**
         * this function is executed when the login fails, set the token as null
         * @param {jqXHR} request
         * @param {String} textStatus
         * @param {String} error
         * @param {Function} callback
         * @private
         */
        _loginError : function (request, textStatus, error, callback) {
            var authProvider = AuthProvider.getInst();
            authProvider.updateToken(null);
            callback(request, textStatus, error);
        }
    });

    /**
     * Export models
     */
     return AuthProxy;
});
