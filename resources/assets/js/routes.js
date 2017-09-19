import VueRouter from 'vue-router';
import GetDetails from './views/GetDetails.vue';
import ShowPassword from './views/ShowPassword.vue';
import EnterPassword from './views/EnterPassword.vue';

export default new VueRouter({
    routes: [
        {
            path: '/',
            component: EnterPassword
        },
        {
            path: '/get-details/:secretKey([a-z0-9]{13};[a-z0-9]{16,32})',
            component: GetDetails
        },
        {
            path: '/show-password/:secretKey([a-z0-9]{13};[a-z0-9]{16,32})',
            component: ShowPassword
        },
        {
            path: '/:secretKey([a-z0-9]{13};[a-z0-9]{16,32})',
            component: ShowPassword
        },
        {
            path: '/*',
            component: EnterPassword
        }
    ]
});
