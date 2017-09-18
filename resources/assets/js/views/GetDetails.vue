<template>
    <div class="container page">
        <p>Password URL to fetch the password: </p>

        <div class="input-group input-group-lg bottom-margin">
            <span class="input-group-addon glyphicon glyphicon-lock"></span>
            <input type="text" :value="secretUrl" id="secret-url" class="form-control" readonly>
        </div>

        <p class="btn-container">
            <router-link to="/"><a class="btn btn-primary btn-lg" role="button">Back</a></router-link>
        </p>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                secretUrl: ''
            }
        },
        mounted: function () {
            let secretKey = this.$route.params.secretKey;

            this.secretUrl = window.location.protocol
                + '//'
                + window.location.host
                + window.location.pathname
                + '#/show-password/'
                + secretKey;
            setTimeout(function () {
                focus("secret-url");
            }, 300);
        }
    }
</script>
