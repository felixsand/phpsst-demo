<template>
    <div class="page">
        <p>Enter the password you wish to share and choose for how long it should be available, as well as for how many times it should be retrievable. After that you will receive an URL that you can distribute.</p>

        <div class="input-group input-group-lg bottom-margin">
            <span for="password-field" class="input-group-addon glyphicon glyphicon-lock" id="sizing-addon1"></span>
            <input v-model="passwordField" aria-label="Password" type="password" id="password-field" class="form-control" placeholder="Password" aria-describedby="sizing-addon1">
        </div>

        <div class="input-group input-group-lg bottom-margin">
            <span for="password-confirm-field" class="input-group-addon glyphicon glyphicon-lock" id="sizing-addon2"></span>
            <input v-model="passwordConfirmField" aria-label="Confirm password" type="password" id="password-confirm-field" class="form-control" placeholder="Confirm Password" aria-describedby="sizing-addon2">
        </div>

        <div class="bottom-margin">
            <!-- Small button group -->
            <div class="btn-group">
                <button class="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="glyphicon glyphicon-time"></span> <span id="select-days-btn-txt">{{selectDaysBtnText}}</span>&nbsp;&nbsp; <span class="caret"></span>
                </button>
                <ul id="days-select" class="dropdown-menu">
                    <li v-for="(label, days) in selectDays"><a href="#" :data-days="days" v-on:click="changeDays">{{label}}</a></li>
                </ul>
            </div>

            <!-- Small button group -->
            <div class="btn-group">
                <button class="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span id="select-hours-btn-txt">{{selectHoursBtnText}}</span> <span class="caret"></span>
                </button>
                <ul id="hours-select" class="dropdown-menu">
                    <li v-for="(label, hours) in selectHours"><a href="#" :data-hours="hours" v-on:click="changeHours">{{label}}</a></li>
                </ul>
            </div>
        </div>

        <div class="bottom-margin">
            <!-- Small button group -->
            <div class="btn-group">
                <button class="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="glyphicon glyphicon-eye-open"></span> <span>{{selectViewsBtnText}}</span> <span class="caret"></span>
                </button>
                <ul id="views-select" class="dropdown-menu">
                    <li v-for="(label, views) in selectViews"><a href="#" :data-views="views" v-on:click="changeViews">{{label}}</a></li>
                </ul>
            </div>
        </div>

        <p class="btn-container"><a class="btn btn-primary btn-lg" v-on:click="storeSecret" id="get-url-btn" href="#" role="button">Get URL</a></p>
    </div>
</template>


<script>
    export default {
        data () {
            return {
                passwordField: '',
                passwordConfirmField: '',
                selectDays: [],
                selectHours: [],
                selectViews: [],
                views: 1,
                hours: 0,
                days: 1,
                selectViewsBtnText: 'Valid for 1 view',
                selectDaysBtnText: 'Valid for 1 day',
                selectHoursBtnText: 'and 0 hour',
            }
        },
        mounted: function () {
            let i;
            for (i = 0; i <= 10; i++) {
                this.selectDays.push(this.getDaysLabel(i));
            }
            for (i = 0; i <= 23; i++) {
                this.selectHours.push(this.getHoursLabel(i));
            }
            for (i = 1; i <= 10; i++) {
                this.selectViews[i] = this.getViewsLabel(i);
            }
        },
        methods: {
            reset: function () {
                this.secretUrl = '';
                this.passwordField = '';
                this.passwordConfirmField = '';
                this.views = 1;
                this.hours = 0;
                this.days = 1;
            },
            storeSecret: function () {
                this.$emit('error', '');
                if (this.passwordConfirmed()) {
                    let formData = new FormData();
                    formData.append('password', this.passwordField);
                    formData.append('views', this.views);
                    formData.append('ttl', (this.hours * 3600) + (this.days * 3600 * 24));

                    let view = this;
                    fetch('/phppst.php', {
                        method: 'post',
                        body: formData
                    }).then(function (response) {
                        return response.json();
                    }).then(function (jsonResponse) {
                        if (jsonResponse.success) {
                            view.$router.push('/get-details/' + jsonResponse.secretKey);
                        } else {
                            this.$emit('error', jsonResponse.errorMsg);
                        }
                    }).catch(function (error) {
                        this.$emit('error', 'Unknown error');
                    });
                }
            },
            focus: function (domId) {
                let element = document.getElementById(domId);
                if (element) {
                    element.select();
                    element.focus();
                }
            },
            passwordConfirmed: function () {
                let psw = this.passwordField;
                let pswConfirm = this.passwordConfirmField;

                if (psw !== pswConfirm) {
                    this.$emit('error', 'You need to enter the same password in the confirm field')
                    return false;
                }

                if (psw === '') {
                    this.$emit('error', 'You need to enter a password');
                    return false;
                }

                return true;
            },
            resetPage: function () {
                this.reset();
                this.$emit('error', '');
                this.page = 'enter-details';
            },
            getDaysLabel: function (day) {
                let label = day + ' day';
                if (day > 1) {
                    label += 's';
                }

                return label;
            },
            getHoursLabel: function (hour) {
                let label = hour + ' hour';
                if (hour > 1) {
                    label += 's';
                }

                return label;
            },
            getViewsLabel: function (view) {
                let label = view + ' view';
                if (view > 1) {
                    label += 's';
                }

                return label;
            },
            changeViews: function (event) {
                event.preventDefault();
                this.views = event.target.getAttribute('data-views');
                this.selectViewsBtnText = 'Valid for ' + this.getViewsLabel(this.views);
            },
            changeDays: function (event) {
                event.preventDefault();
                this.days = event.target.getAttribute('data-days');
                this.selectDaysBtnText = 'Valid for ' + this.getDaysLabel(this.days);
            },
            changeHours: function (event) {
                event.preventDefault();
                this.hours = event.target.getAttribute('data-hours');
                this.selectHoursBtnText = 'and ' + this.getHoursLabel(this.hours);
            }
        }
    }
</script>