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
      // 以下路由暂时注释掉，等待实现
      /*
      {
        path: '/order',
        name: 'Order',
        component: () => import('@/views/order/index.vue')
      },
      {
        path: '/order/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail.vue')
      },
      {
        path: '/community',
        name: 'Community',
        component: () => import('@/views/community/index.vue')
      },
      {
        path: '/community/post/:id',
        name: 'CommunityPost',
        component: () => import('@/views/community/post.vue')
      },
      {
        path: '/community/edit',
        name: 'CommunityEdit',
        component: () => import('@/views/community/edit.vue')
      },
      {
        path: '/message',
        name: 'Message',
        component: () => import('@/views/message/index.vue')
      }
      */
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router