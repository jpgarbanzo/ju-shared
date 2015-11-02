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
define( [
            'jquery',
            'ju-shared/client-vars-manager'
        ],
        function (
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
        INST : 'inst',               // Instance
        MODULE : 'module',           // Module
        LANGUAGE : 'language',
        ID_LANGUAGE : 'id_language',
        LANG_PREFIX : 'langPrefix',
        PAGE : 'page',
        AVAILABLE_LANGUAGES : 'availableLanguages',
        AVAILABLE_CITIZEN_REGISTERS : 'available_citizen_registers',
        USER : 'user',
        DOCTOR : 'doctor',
        CLINIC : 'clinic',
        REDIRECT_SEARCH : 'redirectSearch',
        REDIRECT_PROFILE : 'redirectProfile',
        FORM_DEFAULTS : 'formDefaults',
        // Search Results keys
        RESULTS : 'results',
        RANDOM : 'random',
        WIDGETS : 'widgets',
        // application version
        VERSION : 'ver',
        // indicates whether the user has to accept new terms and conditions
        ACCEPT_NEW_TERMS : 'acceptNewTerms',
        // enabled features
        FEATURES : 'ftrs',
        // access to features by user, get/set should be handled by another class
        ACCESS : 'access'
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
