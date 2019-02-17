<template>
    <div class="page">
        <p>
            Enter the password you wish to share and choose for how long it should be available,
            as well as for how many times it should be retrievable. After that you will receive
            an URL that you can distribute.
        </p>

        <div class="input-group input-group-lg bottom-margin">
            <span for="password-field" class="input-group-addon glyphicon glyphicon-lock" id="sizing-addon1"></span>
            <input v-model="passwordField" aria-label="Password" type="password"
                   id="password-field" class="form-control" placeholder="Password" aria-describedby="sizing-addon1">
        </div>

        <div class="input-group input-group-lg bottom-margin">
            <span for="password-confirm-field" class="input-group-addon glyphicon glyphicon-lock" id="sizing-addon2"></span>
            <input v-model="passwordConfirmField" aria-label="Confirm password" type="password"
                   id="password-confirm-field" class="form-control" placeholder="Confirm Password" aria-describedby="sizing-addon2">
        </div>

        <div class="bottom-margin">
            <nof-days-selector @changed="daysChanged"></nof-days-selector>
            <nof-hours-selector @changed="hoursChanged"></nof-hours-selector>
        </div>

        <div class="bottom-margin">
            <nof-views-selector @changed="viewsChanged"></nof-views-selector>
        </div>

        <p class="btn-container">
            <a class="btn btn-primary btn-lg" @click="storeSecret" id="get-url-btn" href="#" role="button">
                Get URL
            </a>
        </p>
    </div>
</template>


<script>
    import NofViewsSelector from "../components/NofViewsSelector.vue";
    import NofHoursSelector from "../components/NofHoursSelector.vue";
    import NofDaysSelector from "../components/NofDaysSelector.vue";

    export default {
        components: {
            NofDaysSelector,
            NofHoursSelector,
            NofViewsSelector
        },
        data () {
            return {
                passwordField: '',
                passwordConfirmField: '',
                views: 1,
                hours: 0,
                days: 1,
            }
        },
        mounted () {
            this.$emit('error', '');
        },
        methods: {
            viewsChanged (views) {
                this.views = views;
            },
            hoursChanged (hours) {
                this.hours = hours;
            },
            daysChanged (days) {
                this.days = days;
            },
            storeSecret () {
                this.$emit('error', '');
                if (!this.passwordConfirmed()) {
                    return;
                }

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
                        view.$emit('error', jsonResponse.errorMsg);
                    }
                }).catch(function () {
                    view.$emit('error', 'Unknown error');
                });
            },
            passwordConfirmed () {
                if (this.passwordField !== this.passwordConfirmField) {
                    this.$emit('error', 'You need to enter the same password in the confirm field');
                    return false;
                }

                if (this.passwordField === '') {
                    this.$emit('error', 'You need to enter a password');
                    return false;
                }

                return true;
            },
        }
    }
</script>
