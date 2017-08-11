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
        days: 1
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
                        phpsst.focus("password-display");
                    } else {
                        phpsst.errorMsg = jsonResponse.errorMsg;
                    }
                    showPage('password-display-page');
                }).catch(function(error) {
                    phpsst.errorMsg = 'Unknown error';
                    showPage('password-display-page');
                });
            }
        },
        focus: function (domId) {
            document.getElementById(domId).select();
            document.getElementById(domId).focus();
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
            showPage('get-details-page');
            setTimeout(function(){phpsst.focus("secret-url");}, 300);
        },
        resetPage: function () {
            phpsst.reset();
            phpsst.errorMsg = '';
            showPage('enter-details-page');
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
        var views = $(this).data('views');
        var btnTxt = 'Valid for '+views+' view';
        if(views > 1) {
            btnTxt += 's';
        }
        $('#select-valid-btn-txt').text(btnTxt);
        phpsst.views = views;
    });
    
    $('#days-select li a').click(function(event){
        event.preventDefault();
        var days = $(this).data('days');
        var btnTxt = 'Valid for '+days+' day';
        if(days > 1) {
            btnTxt += 's';
        }
        $('#select-days-btn-txt').text(btnTxt);
        phpsst.days = days;
    });
    
    $('#hours-select li a').click(function(event){
        event.preventDefault();
        var hours = $(this).data('hours');
        var btnTxt = 'and '+hours+' hour';
        if(hours > 1) {
            btnTxt += 's';
        }
        $('#select-hours-btn-txt').text(btnTxt);
        phpsst.hours = hours;
    });
});

function showPage(page) {
    $('.page').removeClass('active');
    $('#' + page + '.page').addClass('active');
}
