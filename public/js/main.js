/**
 * @copyright Copyright (c) 2017 Felix Sandström
 * @license   MIT
 */
"use strict";

var phpsst = new Vue({
    el: '#phpsst',
    data: {
        errorMsg: '',
        passwordDisplay: '',
        secretUrl: '',
        passwordField: '',
        passwordConfirmField: '',
        views: 1,
        hours: 0,
        days: 1,
        page: 'enter-details',
        selectViewsBtnText: 'Valid for 1 view',
        selectDaysBtnText: 'Valid for 1 day',
        selectHoursBtnText: 'and 0 hour'
    },
    methods: {
        reset: function () {
            phpsst.passwordDisplay = '';
            phpsst.secretUrl = '';
            phpsst.passwordField = '';
            phpsst.passwordConfirmField = '';
            phpsst.views = 1;
            phpsst.hours = 0;
            phpsst.days = 1;
        },
        storeSecret: function () {
            phpsst.errorMsg = '';
            if (phpsst.passwordConfirmed()) {
                var formData = new FormData();
                formData.append('password', phpsst.passwordField);
                formData.append('views', phpsst.views);
                formData.append('ttl', (phpsst.hours * 3600) + (phpsst.days * 3600 * 24));

                fetch('/backend.php', {
                    method: 'post',
                    body: formData
                }).then(function(response) {
                    return response.json();
                }).then(function(jsonResponse) {
                    if (jsonResponse.success) {
                        phpsst.showUrl(jsonResponse.secretKey);
                    } else {
                        phpsst.errorMsg = jsonResponse.errorMsg;
                    }
                }).catch(function(error) {
                    phpsst.errorMsg = 'Unknown error';
                });
            }
        },
        checkForSecretKeys: function () {
            var hash = window.location.hash.substring(1);
            if (hash) {
                phpsst.reset();
                var formData = new FormData();
                formData.append('secretKey', hash);

                fetch('/backend.php', {
                    method: 'post',
                    body: formData
                }).then(function(response) {
                    return response.json();
                }).then(function(jsonResponse) {
                    if (jsonResponse.success) {
                        phpsst.passwordDisplay = jsonResponse.secret;
                        setTimeout(function(){phpsst.focus("password-display");}, 300);
                    } else {
                        phpsst.errorMsg = jsonResponse.errorMsg;
                    }
                    phpsst.page = 'password-display';
                }).catch(function(error) {
                    phpsst.errorMsg = 'Unknown error';
                    phpsst.page = 'password-display';
                });
            }
        },
        focus: function (domId) {
            var element = document.getElementById(domId);
            if (element) {
                element.select();
                element.focus();
            }
        },
        passwordConfirmed: function () {
            var psw = phpsst.passwordField;
            var pswConfirm = phpsst.passwordConfirmField;

            if (psw !== pswConfirm) {
                phpsst.errorMsg = 'You need to enter the same password in the confirm field';
                return false;
            }

            if (psw === '') {
                phpsst.errorMsg = 'You need to enter a password';
                return false;
            }

            return true;
        },
        showUrl: function (key) {
            phpsst.secretUrl = window.location.protocol
                + '//'
                + window.location.host
                + window.location.pathname
                + '#'
                + key;
            phpsst.page = 'get-details';
            setTimeout(function(){phpsst.focus("secret-url");}, 300);
        },
        resetPage: function () {
            phpsst.reset();
            phpsst.errorMsg = '';
            phpsst.page = 'enter-details';
        }
    }
});

window.onhashchange = function() {
    phpsst.checkForSecretKeys();
};
phpsst.checkForSecretKeys();


$(document).ready(function(){
    $('#views-select li a').click(function(event){
        event.preventDefault();
        phpsst.views = $(this).data('views');
        phpsst.selectViewsBtnText = 'Valid for '+phpsst.views+' view';
        if(phpsst.views > 1) {
            phpsst.selectViewsBtnText += 's';
        }
    });
    
    $('#days-select li a').click(function(event){
        event.preventDefault();
        phpsst.days = $(this).data('days');
        phpsst.selectDaysBtnText = 'Valid for '+phpsst.days+' day';
        if(phpsst.days > 1) {
            phpsst.selectDaysBtnText += 's';
        }
    });
    
    $('#hours-select li a').click(function(event){
        event.preventDefault();
        phpsst.hours = $(this).data('hours');
        phpsst.selectHoursBtnText = 'and '+phpsst.hours+' hour';
        if(phpsst.hours > 1) {
            phpsst.selectHoursBtnText += 's';
        }
    });
});
