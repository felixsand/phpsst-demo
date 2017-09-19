<template>
    <div>
        <error-displayer :message="errorMsg"></error-displayer>
        <router-view @error="onError"></router-view>
    </div>
</template>

<script>
    import ErrorDisplayer from './components/ErrorDisplayer.vue';
    import router from './routes';

    export default {
        data () {
            return {
                errorMsg: '',
            }
        },
        components: {
            ErrorDisplayer
        },
        router,
        methods: {
            onError: function (errorMsg) {
                this.errorMsg = errorMsg;
            }
        }
    }
</script>
