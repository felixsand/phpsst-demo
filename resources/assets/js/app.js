/**
 * @copyright Copyright (c) 2017 Felix Sandström
 * @license   MIT
 */
"use strict";

import Vue from 'vue';
import VueRouter from 'vue-router';
import ErrorDisplayer from './components/ErrorDisplayer.vue';
import router from './routes';

const {fetch, Request, Response, Headers} = require('fetch-ponyfill')();

Vue.use(VueRouter);

window.focusInput = function (domId) {
    setTimeout(function () {
        let element = document.getElementById(domId);
        if (element) {
            element.select();
            element.focus();
        }
    }, 300);
};

let phpsst = new Vue({
    el: '#phpsst',
    data: {
        errorMsg: '',
    },
    components: {
        ErrorDisplayer
    },
    router,
    methods: {
        onError: function (errorMsg) {
            this.errorMsg = errorMsg;
        }
    }
});

// todo - enable the serviceWorker again - and update files to cache
/*
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('service-worker.js')
        .then(function () {
            console.log("Service Worker Registered");
        });
}
*/
