import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: '/cart',
        name: 'Cart',
        component: () => import('@/views/cart/index.vue')
      },
      {
        path: '/user/profile',
        name: 'Profile',
        component: () => import('@/views/user/profile.vue')
      },
      {
        path: '/product/list',
        name: 'ProductList',
        component: () => import('@/views/product/list.vue')
      },
      {
        path: '/product/:id',
        name: 'ProductDetail',
        component: () => import('@/views/product/detail.vue')
      },
      {
        path: '/user/pet',
        name: 'PetProfile',
        component: () => import('@/views/user/pet/index.vue')
      },
      {
        path: '/user/pet/feeding-plan',
        name: 'FeedingPlan',
        component: () => import('@/views/user/pet/feeding-plan.vue')
      },
      {
        path: '/community',
        name: 'Community',
        component: () => import('@/views/community/index.vue')
      },
      {
        path: '/community/article/:id',
        name: 'Article',
        component: () => import('@/views/community/article.vue')
      },
      {
        path: '/community/edit',
        name: 'ArticleEdit',
        component: () => import('@/views/community/edit.vue')
      },
      {
        path: '/message',
        name: 'Message',
        component: () => import('@/views/message/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/register.vue')
  },
  {
    path: '/user/login',
    redirect: '/login'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  console.log('Route navigation:', { to, from })
  next()
})

export default router