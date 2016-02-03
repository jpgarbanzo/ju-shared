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
 * @file WebStorage Wrapper
 * @description WebStorage Wrapper, uses localStorage when available, and falls back on cookies.
 * Triggers an event if there is a change on a web storage key.
 * @requires jquery
 * @requires ju-shared/observable-class
 * @requires ju-shared/util
 * @requires ju-shared/lib/vendor/polyfills/webstorage-polyfill
 * @module ju-shared/web-storage
 * @listens module:ju-shared/web-storage#storageEvent
 * @fires module:ju-shared/web-storage#storageEvent
 * @extends ju-shared/observable-class
 */

define([
        'jquery',
        'ju-shared/observable-class',
        'ju-shared/util',
        'ju-shared/lib/vendor/polyfills/webstorage-polyfill'
    ],
    function (
        $,
        ObservableClass,
        Util,
        WebStoragePolyfill
    ){

        'use strict';

        var WebStorage = ObservableClass.extend({

            /**
             * @constructor
             * @alias module:ju-shared/web-storage
             * @param {Object} [opts] - configuration options
             * @param {Boolean} [opts.useCookies=false] - force the use of cookies instead of web storage.
             * @param {Boolean} [opts.fireStorageEvent=true] - activate the listener of storage event, it is fired when a storage area (localStorage or sessionStorage) has been modified.
             */
            init : function (opts) {
                this.useCookies = false;
                this.fireStorageEvent = true;
                if (opts) {
                    this.useCookies = opts.useCookies || this.useCookies;
                    this.fireStorageEvent = opts.fireStorageEvent || this.fireStorageEvent;
                }
                this.isLocalStorageAvailable = this.getIsLocalStorageAvailable();
                // use cookies if the browser doesn't support local storage
                if ( this.useCookies || !this.isLocalStorageAvailable ){
                    WebStoragePolyfill.init();
                    this.useCookies = true;
                }

                if (this.isLocalStorageAvailable && this.fireStorageEvent){
                    window.addEventListener("storage", $.proxy(this.storageEventHandler, this), false);
                }
            },

            /**
             * Sets the item in the storage
             * @param {String} key - A String containing the name of the key you want to create/update.
             * @param {String} value - A DOMString containing the value you want to give the key you are creating/updating.
             */
            setItem : function (key, value) {     // jshint ignore:line
                window.localStorage.setItem(key, value);
            },

            /**
             * Gets the item from the storage
             * @param {String} key - A String containing the name of the key you want to create/update.
             * @return {String} value for the given key
             */
            getItem : function (key) {
                return window.localStorage.getItem(key);
            },

            /**
             * Removes the item from the storage
             * @param {String} key - A String containing the name of the key you want to create/update.
             */
            removeItem : function (key) {
                window.localStorage.removeItem(key);
            },

            /***
             * Check if localStorage is natively supported
             * @returns {Boolean}
             */
            getIsLocalStorageAvailable : function() {
                var storage = window.localStorage,
                    storageAvailable = false;
                try {
                    storage.setItem('testKey', '1');
                    storage.removeItem('testKey');
                    storageAvailable = true;
                } catch (e) {
                    log('localStorage is not available');
                }

                return storageAvailable;
            },
            /**
             * Indicates if the library is using native localStorage(true) otherwise will use cookies
             * @returns {Boolean}
             */
            isNativeSupport : function(){
                return this.isLocalStorageAvailable;
            },

            /**
             * Clear local storage data
             */
            deleteLocalStorage : function() {
                window.localStorage.clear();
            },

            /**
             * Event handler for storage events
             * @param event {StorageEvent} - event {@link https://developer.mozilla.org/en-US/docs/Web/Events/storage}
             * @todo implement an event listener for key, right now fires an event for a change in any key
             */
            storageEventHandler : function (event) {
                this.trigger(WebStorage.EV.STORAGE_EVENT, event);
            }
        });

        WebStorage.classMembers({
            EV : {
                /**
                 * Event triggered when a storage value is updated
                 * {@link https://developer.mozilla.org/en-US/docs/Web/Events/storage}
                 * @event module:ju-shared/web-storage#storageEvent
                 */
                STORAGE_EVENT : 'storageEvent'
            },
            formatKey : function () {
                return Util.format.apply(Util, arguments);
            }
        });

        return WebStorage;

    });