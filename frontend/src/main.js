/**
 * @copyright Copyright (c) 2019 Felix Sandström
 * @license   MIT
 */
"use strict";

import Vue from 'vue';
import VueRouter from 'vue-router';
import Phpsst from './Phpsst.vue'

// eslint-disable-next-line no-use-before-define
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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
      .register('service-worker.js')
      .then(function () {
        console.log("Service Worker Registered");
      });
}
