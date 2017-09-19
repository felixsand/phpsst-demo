/**
 * @copyright Copyright (c) 2017 Felix Sandström
 * @license   MIT
 */
"use strict";

import Vue from 'vue';
import VueRouter from 'vue-router';
import Phpsst from './Phpsst.vue'

const {fetch, Request, Response, Headers} = require('fetch-ponyfill')();

window.focusInput = function (domId) {
    setTimeout(function () {
        let element = document.getElementById(domId);
        if (element) {
            element.select();
            element.focus();
        }
    }, 300);
};

Vue.use(VueRouter);
new Vue(Phpsst).$mount('#phpsst');

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
