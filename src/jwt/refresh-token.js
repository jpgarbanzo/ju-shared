/**                   _
 *  _             _ _| |_
 * | |           | |_   _|
 * | |___  _   _ | | |_|
 * | "_  \| | | || | | |
 * | | | || |_| || | | |
 * |_| |_|\___,_||_| |_|
 *
 * (c) Huli Inc
 */


/**
 * @file Refresh token service
 * @description In charge of refreshing the access tokens when is needed it.
 * @requires jquery
 * @requires ju-shared/observable-class
 * @requires ju-shared/jwt/auth-provider
 * @requires ju-shared/jwt/proxy
 * @module ju-shared/jwt/refresh-token
 * @extends ju-shared/observable-class
 * @listens module:ju-shared/jwt/auth-provider#TOKEN_UPDATED
 */

define([
        "jquery",
        "ju-shared/observable-class",
        "ju-shared/jwt/auth-provider",
        "ju-shared/jwt/proxy"
    ],
    function (
        $,
        ObservableClass,
        AuthProvider,
        AuthProxy
    ){
        "use strict";


        /** Constants **/

        /**
         * @constant {Number} NEEDED_TIME_TO_REFRESH - time to refresh the token before it expires
         */
        var NEEDED_TIME_TO_REFRESH = 2 * 60;


        // timeout id
        var timeoutId = null;


        var RefreshToken = ObservableClass.extend({

            /**
             * @constructor
             * @alias module:ju-shared/jwt/refresh-token
             * @param {Boolean} [autoStart] - indicates if want to start the timeout on the init phase
             */
            init : function (autoStart) {
                this.proxy = AuthProxy.getInst();
                this.authProvider = AuthProvider.getInst();
                this.authProvider.on(AuthProvider.EV.TOKEN_UPDATED, $.proxy(this.restart,this));
                if (autoStart){
                    this.start();
                }
            },

            /**
             * Starts the process that verifies if needs to update the token
             */
            start : function(){
                if (this.authProvider.isTokenValid()){

                    var expTime = this.authProvider.getExpirationTime();
                    log("RefreshToken: ExpTime " + (new Date(expTime * 1000)).toLocaleTimeString());

                    var remainingTime = expTime - Math.floor(Date.now() / 1000);
                    log("RefreshToken: RemainingTime " +  remainingTime);

                    if (remainingTime <= NEEDED_TIME_TO_REFRESH){
                        this._requestNewToken();
                    }else{
                        var nextValidation = remainingTime - NEEDED_TIME_TO_REFRESH;
                        log("RefreshToken: NextValidation " +  nextValidation);
                        timeoutId = window.setTimeout($.proxy(this.start,this), nextValidation * 1000);
                    }
                }else{
                    Logger.error("RefreshToken: token invalid");
                }
            },

            /**
             * Stops the timeout execution
             */
            stop : function () {
                window.clearTimeout(timeoutId);
                timeoutId = undefined;
            },

            /**
             * Stops the current timeout and starts a new one
             */
            restart : function(){
                log("RefreshToken: timeout stopped and restarted");
                this.stop();
                this.start();
            },

            /**
             * Request a new token to the Auth server.
             * @private
             */
            _requestNewToken : function (){
                log("RefreshToken: requesting a new token");
                this.proxy.refreshToken(
                    function onSuccess(){
                        log("RefreshToken: token updated");
                    },
                    function onError(){
                        Logger.error("RefreshToken: couldn't refresh the token");
                    }
                );
            }
        });

        // Exports
        return RefreshToken;
});