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
 * Application config client-side module
 * This layer provides access to server side application settings
 */
define([
            'jquery',
            'ju-shared/client-vars-manager'
        ],
        function(
            $,
            ClientVarsManager
        ) {
    'use strict';

    var CONTEXT_VARS_NAME = 'appConfig';

    /**
     * App config manager in the client side
     * Contains application settings coming from the server side
     */
    var AppConfigManager = ClientVarsManager.extend({
    });

    var appConfigManagerInstance = (new AppConfigManager());

    // Keys comming from the server side
    var keys = {
    };

    // Store them under the alias k
    appConfigManagerInstance.k = keys;

    /**
     *  Checks for any initial app configuration variables in the global scope
     *  that the server rendered in the page
     */
    appConfigManagerInstance.append(window[CONTEXT_VARS_NAME], CONTEXT_VARS_NAME);

    // Exports
    return appConfigManagerInstance;
    // context.AppConfig = appConfigManagerInstance;

});
