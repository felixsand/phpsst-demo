import VueRouter from 'vue-router';
import GetDetails from './views/GetDetails.vue';
import ShowPassword from './views/ShowPassword.vue';
import EnterPassword from './views/EnterPassword.vue';

let routes = [
    {
        path: '/',
        component: EnterPassword
    },
    {
        path: '/get-details/:secretKey',
        component: GetDetails
    },
    {
        path: '/show-password/:secretKey',
        component: ShowPassword
    }
];

export default new VueRouter({
    routes
});
