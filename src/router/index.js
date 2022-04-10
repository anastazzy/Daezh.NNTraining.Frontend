import {createRouter, createWebHistory} from 'vue-router'


import Index from '@/views/Index.vue'
import Main from "@/views/pages/Main";

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index,
        redirect: { name: 'ChoseModelBeforeCreating' },
        children: [
            {
                path: 'ChoseModelBeforeCreating',
                name: 'ChoseModelBeforeCreating',
                component: () =>
                    import(/* webpackChunkName: "ChoseModelBeforeCreating" */ '@/views/pages/ChoseModelBeforeCreating.vue'),
            },
            {
                path: 'main',
                component: Main,
            },
            // {
            //     path: '/tasks/new',
            //     name: 'TaskNew',
            //     component: () => import(/* webpackChunkName: "TaskNew" */ '@/views/app/pages/TaskNew.vue')
            // },
            // {
            //     path: '/tasks/:id',
            //     props: true,
            //     name: 'Task',
            //     component: () => import(/* webpackChunkName: "Task" */ '@/views/app/pages/Task.vue'),
            // },
            // {
            //     path: '/users',
            //     name: 'Users',
            //     component: () => import(/* webpackChunkName: "Users" */ '@/views/app/pages/Users.vue')
            // },
            // {
            //     path: '/users/new',
            //     name: 'UserNew',
            //     component: () => import(/* webpackChunkName: "UserNew" */ '@/views/app/pages/User.vue')
            // },
            // {
            //     path: '/users/:id',
            //     name: 'User',
            //     component: () => import(/* webpackChunkName: "User" */ '@/views/app/pages/User.vue')
            // },
        ]
    }
]


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    linkActiveClass: 'is-active',
    linkExactActiveClass: '',
    routes
})

export default router;