"use strict";
var CACHE_NAME = 'phpsst-v1';

// A list of paths to cache
var REQUIRED_FILES = [
    '/',
    '/css/main.min.css',
    '/js/main.min.js',
    '/index.html',
    '/manifest.json',
    '/service-worker.js',
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.2/vue.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap-theme.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/fonts/glyphicons-halflings-regular.woff2'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(REQUIRED_FILES);
        }).then(function() {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }

                return fetch(event.request);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});
