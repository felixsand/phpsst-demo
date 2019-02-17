<template>
    <div class="container page">
        <p>Password URL to fetch the password: </p>

        <div class="input-group input-group-lg bottom-margin">
            <span class="input-group-addon glyphicon glyphicon-lock"></span>
            <textarea id="secret-url" class="form-control" readonly v-model="secretUrl"></textarea>
        </div>

        <p class="btn-container">
            <router-link to="/"><a class="btn btn-primary btn-lg" role="button">Back</a></router-link>
        </p>
    </div>
</template>

<script>
    export default {
        data (){
            return {
                secretUrl: ''
            }
        },
        mounted () {
            this.$emit('error', '');

            let secretKey = this.$route.params.secretKey;

            this.secretUrl = window.location.protocol
                + '//'
                + window.location.host
                + window.location.pathname
                + '#/show-password/'
                + secretKey;

            window.focusInput("secret-url");
        }
    }
</script>
