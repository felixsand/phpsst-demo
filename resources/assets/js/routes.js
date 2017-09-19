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
            path: '/get-details/:secretKey(.*;.*)',
            component: GetDetails
        },
        {
            path: '/show-password/:secretKey',
            component: ShowPassword
        },
        {
            path: '/:secretKey(.*;.*)',
            component: ShowPassword
        }
    ]
});
