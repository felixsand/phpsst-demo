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
        selectHoursBtnText: 'and 0 hour',
        selectDays: [],
        selectHours: [],
        selectViews: []
    },
    mounted: function () {
        var i = 0;
        for (i = 0; i<=10; i++) {
            this.selectDays.push(this.getDaysLabel(i));
        }
        for (i = 0; i<=23; i++) {
            this.selectHours.push(this.getHoursLabel(i));
        }
        for (i = 1; i<=10; i++) {
            this.selectViews[i] = this.getViewsLabel(i);
        }

        window.onhashchange = function() {
            phpsst.checkForSecretKeys();
        };
        this.checkForSecretKeys();
    },
    methods: {
        reset: function () {
            this.passwordDisplay = '';
            this.secretUrl = '';
            this.passwordField = '';
            this.passwordConfirmField = '';
            this.views = 1;
            this.hours = 0;
            this.days = 1;
        },
        storeSecret: function () {
            this.errorMsg = '';
            if (this.passwordConfirmed()) {
                var formData = new FormData();
                formData.append('password', this.passwordField);
                formData.append('views', this.views);
                formData.append('ttl', (this.hours * 3600) + (this.days * 3600 * 24));

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
                this.reset();
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
            var psw = this.passwordField;
            var pswConfirm = this.passwordConfirmField;

            if (psw !== pswConfirm) {
                this.errorMsg = 'You need to enter the same password in the confirm field';
                return false;
            }

            if (psw === '') {
                this.errorMsg = 'You need to enter a password';
                return false;
            }

            return true;
        },
        showUrl: function (key) {
            this.secretUrl = window.location.protocol
                + '//'
                + window.location.host
                + window.location.pathname
                + '#'
                + key;
            this.page = 'get-details';
            setTimeout(function(){phpsst.focus("secret-url");}, 300);
        },
        resetPage: function () {
            this.reset();
            this.errorMsg = '';
            this.page = 'enter-details';
        },
        getDaysLabel: function (day) {
            var label = day+' day';
            if (day > 1) {
                label += 's';
            }

            return label;
        },
        getHoursLabel: function (hour) {
            var label = hour + ' hour';
            if (hour > 1) {
                label += 's';
            }

            return label;
        },
        getViewsLabel: function (view) {
            var label = view + ' view';
            if (view > 1) {
                label += 's';
            }

            return label;
        },
        changeViews: function (event) {
            event.preventDefault();
            phpsst.views = event.target.getAttribute('data-views');
            phpsst.selectViewsBtnText = 'Valid for '+phpsst.views+' view';
            if(phpsst.views > 1) {
                phpsst.selectViewsBtnText += 's';
            }
        },
        changeDays: function (event) {
            event.preventDefault();
            phpsst.days = event.target.getAttribute('data-days');
            phpsst.selectDaysBtnText = 'Valid for '+phpsst.days+' day';
            if(phpsst.days > 1) {
                phpsst.selectDaysBtnText += 's';
            }
        },
        changeHours: function (event) {
            event.preventDefault();
            phpsst.hours = event.target.getAttribute('data-hours');
            phpsst.selectHoursBtnText = 'and '+phpsst.hours+' hour';
            if(phpsst.hours > 1) {
                phpsst.selectHoursBtnText += 's';
            }
        }
    }
});
