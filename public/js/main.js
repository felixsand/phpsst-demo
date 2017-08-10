/**
 * @copyright Copyright (c) 2017 Felix Sandström
 * @license   MIT
 */
"use strict";
$(document).ready(function(){
    $('#get-url-btn').click(function(){
        clearWarnings();
        if (passwordConfirmed()) {
            var password = $('#password-field').val();
            var views = $('input[name=views]').val();
            var ttl = ($('input[name=hours]').val() * 3600) + ($('input[name=days]').val() * 3600 * 24);
            $.post('/backend.php', {password: password, ttl: ttl, views: views}, function(secretKey){
                showUrl(secretKey);
            });
        }
    });
    
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
        $('#alert-container').html('');
        showPage($(this).data('page'));
    });

    $(window).on('hashchange', function() {
        checkForSecretKeys();
    });

    checkForSecretKeys();
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
    $('#alert-container').html('<div class="alert alert-danger" role="alert">'+ msg +'</div>');
}

function clearWarnings() {
    $('#alert-container').empty();
}

function checkForSecretKeys() {
    var hash = window.location.hash.substring(1);
    if (hash) {
        resetInputFields();
        $.post('/backend.php', {secretKey: hash}, function(password){
            var $passwordDisplay = $('#password-display');
            $passwordDisplay.val(password);
            $passwordDisplay.select();
            showPage('password-display-page');
        }).fail(function(response) {
            showWarning(response.responseText);
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
