import {createRouter, createWebHistory} from 'vue-router'


import Index from '@/views/Index.vue'

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index,
        redirect: { name: 'models' },
        children: [
            {
                path: 'models',
                name: 'models',
                component: () =>
                    import(/* webpackChunkName: "Models" */ '@/views/pages/Models.vue'),
            },
            {
                path: 'models/:id',
                name:'model',
                component:()=>
                    import(/* webpackChunkName: "Model" */ '@/views/pages/Model.vue'),
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
    history: createWebHistory(),
    routes
})

export default router;