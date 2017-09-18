<template>
    <div v-if="message">
        <div class="alert alert-danger" role="alert">{{message}}</div>
    </div>
</template>

<script>
    export default {
        name: 'error-displayer',
        props: ['message'],
        data () {
            return {
            }
        }
    }
</script>

<style>

</style>
