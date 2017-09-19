<template>
    <div class="container page">
        <p>Password: </p>

        <div class="input-group input-group-lg bottom-margin">
            <span class="input-group-addon glyphicon glyphicon-lock"></span>
            <textarea id="password-display" class="form-control" readonly>{{password}}</textarea>
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
                password: ''
            }
        },
        mounted: function () {
            this.$emit('error', '');

            let formData = new FormData();
            formData.append('secretKey', this.$route.params.secretKey);

            let view = this;
            fetch('/phppst.php', {
                method: 'post',
                body: formData
            }).then(function (response) {
                return response.json();
            }).then(function (jsonResponse) {
                if (jsonResponse.success) {
                    view.password = jsonResponse.secret;
                    focusInput("password-display");
                } else {
                    view.$emit('error', jsonResponse.errorMsg);
                }
            }).catch(function (error) {
                view.$emit('error', 'Unknown error');
            });
        }
    }
</script>
