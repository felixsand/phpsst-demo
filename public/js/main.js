/**
 * @copyright Copyright (c) 2017 Felix Sandström
 * @license   MIT
 */
"use strict";

var app = new Vue({
    el: '#app',
    data: {
        errorMsg: ''
    },
    methods: {
        storeSecret: function () {
            storeSecret();
        }
    }
});

window.onhashchange = function() {
    checkForSecretKeys();
};
checkForSecretKeys();

function storeSecret() {
    clearWarnings();
    if (passwordConfirmed()) {
        var formData = new FormData();
        formData.append('password', $('#password-field').val());
        formData.append('views', $('input[name=views]').val());
        formData.append('ttl', ($('input[name=hours]').val() * 3600) + ($('input[name=days]').val() * 3600 * 24));

        fetch('/backend.php', {
            method: 'post',
            body: formData
        }).then(function(response) {
            return response.json();
        }).then(function(jsonResponse) {
            if (jsonResponse.success) {
                showUrl(jsonResponse.secretKey);
            } else {
                showWarning(jsonResponse.errorMsg);
            }
        }).catch(function(error) {
            showWarning('Unknown error');
        });
    }
}

$(document).ready(function(){
    $('#views-select li a').click(function(event){
        event.preventDefault();
        var views = $(this).data('views');
        var btnTxt = 'Valid for '+views+' view';
        if(views > 1) {
            btnTxt += 's';
        }
        $('#select-valid-btn-txt').text(btnTxt);
        $('input[name=views]').val(views);
    });
    
    $('#days-select li a').click(function(event){
        event.preventDefault();
        var days = $(this).data('days');
        var btnTxt = 'Valid for '+days+' day';
        if(days > 1) {
            btnTxt += 's';
        }
        $('#select-days-btn-txt').text(btnTxt);
        $('input[name=days]').val(days);
    });
    
    $('#hours-select li a').click(function(event){
        event.preventDefault();
        var hours = $(this).data('hours');
        var btnTxt = 'and '+hours+' hour';
        if(hours > 1) {
            btnTxt += 's';
        }
        $('#select-hours-btn-txt').text(btnTxt);
        $('input[name=hours]').val(hours);
    });

    $('.page-jumper').click(function() {
        resetInputFields();
        app.errorMsg = '';
        showPage($(this).data('page'));
    });
});


function passwordConfirmed() {
    var psw = $('#password-field').val();
    var pswConfirm = $('#password-confirm-field').val();
    
    if (psw !== pswConfirm) {
        showWarning('You need to enter the same password in the confirm field');
        return false;
    }
    
    if (psw === '') {
        showWarning('You need to enter a password');
        return false;
    }
    
    return true;
}

function showUrl(key) {
    $('#secret-url').val(window.location.protocol + '//' + window.location.host + window.location.pathname + '#' + key);
    showPage('get-details-page');
    setTimeout(function(){ $('#secret-url').select(); }, 300);
}

function showWarning(msg) {
    app.errorMsg = msg;
}

function clearWarnings() {
    app.errorMsg = '';
}

function checkForSecretKeys() {
    var hash = window.location.hash.substring(1);
    if (hash) {
        resetInputFields();
        var formData = new FormData();
        formData.append('secretKey', hash);

        fetch('/backend.php', {
            method: 'post',
            body: formData
        }).then(function(response) {
            return response.json();
        }).then(function(jsonResponse) {
            if (jsonResponse.success) {
                var $passwordDisplay = $('#password-display');
                $passwordDisplay.val(jsonResponse.secret);
                $passwordDisplay.select();
            } else {
                showWarning(jsonResponse.errorMsg);
            }
            showPage('password-display-page');
        }).catch(function(error) {
            showWarning('Unknown error');
            showPage('password-display-page');
        });
    }
}

function showPage(page) {
    $('.page').removeClass('active');
    $('#' + page + '.page').addClass('active');
}

function resetInputFields() {
    $('input').val('');
    $('input[name=hours]').val('0');
    $('input[name=days]').val('1');
    $('input[name=views]').val('1');
}
