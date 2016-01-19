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
 * @file Represents an JWT token
 * @description Represents an JWT
 * @requires ju-shared/class
 * @module ju-shared/jwt/token
 * @extends ju-shared/class
 */

define([
        'ju-shared/class'
    ],
    function (
        Class
    ){
        'use strict';


        /** Constants **/

        /**
         * @constant {String} ERROR_INVALID_TOKEN - Error message for invalid tokens
         */
        var ERROR_INVALID_TOKEN = "Invalid token";


        /**
         * Create an instance of a JWT token
         * @constructor
         * @alias module:ju-shared/jwt/token
         * @param {String} token - JWT token
         * @returns {?Object} jwtToken
         */
        var JWTToken = Class.extend({

            /**
             * Create an instance of a JWT token
             * @param {String} token - JWT token
             * @returns {?Object} jwtToken
             */
            init : function (token) {
                /**
                 * Original JWT Token string
                 * @member source {String}
                 * @default null
                 */
                this.source = null;

                /**
                 * Decoded payload
                 * @member payload {Object}
                 * @default {}
                 */
                this.payload = {};

                if (this.validateToken(token)) {
                    this.source = token;
                }else{
                    return null;
                }
            },

            /**
             * Get the JWT token
             * @returns {String}
             */
            getToken : function () {
                return this.source;
            },

            /**
             * Get the decoded token payload
             * @returns {?Object} json payload
             */
            getPayload : function () {
               return this.payload;
            },

            /**
             * Check if the token is still valid
             * Check the expiration date
             * @returns {Boolean} if the token is valid
             */
            isValid : function () {
                return false;

            },

            /**
             * Parse and validate the token provided
             * save the decoded payload into the payload member.
             * @param {String} token - JWT token
             * @returns {Boolean}  if the token is valid
             */
            validateToken : function(token){
                var tokenValues = [];
                var decodedPayload = null;
                if (token) {
                    tokenValues = token.split('.');
                    if (tokenValues.length === 3) {
                        decodedPayload = this._decode(tokenValues[1]);
                        if (decodedPayload) {
                            this.payload = decodedPayload;
                            return true;
                        }
                    }
                }
                return false;
            },

            /**
             * Decode the base64 value
             * @param {String} value - base64 String (encoded JSON)
             * @returns {!Object} decoded JSON
             */
            _decode : function(value) {
                try{
                    return JSON.parse(window.atob(value));
                }catch(error){
                    Logger.error(ERROR_INVALID_TOKEN, error);
                    return null;
                }
            }

        });

        /*
        AWTToken.classMembers({

        });*/

        // Exports
        return JWTToken;
});