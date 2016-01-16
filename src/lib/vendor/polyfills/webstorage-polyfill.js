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
 * @file Web storage polyfill
 * @description Web storate polyfill, it uses cookies as a fallback
 * @module ju-shared/lib/vendor/polyfills/webstorage-polyfill
 * @author Unknown
 */

define([],
        function() {

    'use strict';

    var webStoragePolyfill = {

        /**
         * Initialize the polyfill
         */
        init : function () {
            var isStorageAvailable = function (storage) {
                if (typeof storage == 'undefined') return false;
                try { // hack for safari incognito
                    storage.setItem("storage", "");
                    storage.getItem("storage");
                    storage.removeItem("storage");
                    return true;
                } catch (err) {
                    return false;
                }
            };

            if (!isStorageAvailable(window.localStorage) || isStorageAvailable(window.sessionStorage))
                (function () {

                    var Storage = function (type) {
                        function createCookie(name, value, days) {
                            var date, expires;

                            if (days) {
                                date = new Date();
                                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                                expires = "; expires=" + date.toGMTString();
                            } else {
                                expires = "";
                            }
                            document.cookie = name + "=" + value + expires + "; path=/";
                        }

                        function readCookie(name) {
                            var nameEQ = name + "=",
                                ca = document.cookie.split(';'),
                                i, c;

                            for (i = 0; i < ca.length; i++) {
                                c = ca[i];
                                while (c.charAt(0) == ' ') {
                                    c = c.substring(1, c.length);
                                }

                                if (c.indexOf(nameEQ) == 0) {
                                    return c.substring(nameEQ.length, c.length);
                                }
                            }
                            return null;
                        }

                        function setData(data) {
                            data = JSON.stringify(data);
                            if (type == 'session') {
                                window.name = data;
                            } else {
                                createCookie('localStorage', data, 365);
                            }
                        }

                        function clearData() {
                            if (type == 'session') {
                                window.name = '';
                            } else {
                                createCookie('localStorage', '', 365);
                            }
                        }

                        function getData() {
                            var data = type == 'session' ? window.name : readCookie('localStorage');
                            return data ? JSON.parse(data) : {};
                        }


                        // initialise if there's already data
                        var data = getData();

                        return {
                            length: 0,
                            clear: function () {
                                data = {};
                                this.length = 0;
                                clearData();
                            },
                            getItem: function (key) {
                                return data[key] === undefined ? null : data[key];
                            },
                            key: function (i) {
                                // not perfect, but works
                                var ctr = 0;
                                for (var k in data) {
                                    if (ctr == i) return k;
                                    else ctr++;
                                }
                                return null;
                            },
                            removeItem: function (key) {
                                if (data[key] === undefined) this.length--;
                                delete data[key];
                                setData(data);
                            },
                            setItem: function (key, value) {
                                if (data[key] === undefined) this.length++;
                                data[key] = value + ''; // forces the value to a string
                                setData(data);
                            }
                        };
                    };

                    if (!isStorageAvailable(window.localStorage))  window.localStorage = new Storage('local');
                    if (!isStorageAvailable(window.sessionStorage)) window.sessionStorage = new Storage('session');

                })();
        }
    };

    return webStoragePolyfill;
});
