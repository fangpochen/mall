import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { ElMessage } from 'element-plus'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useUserStore } from '@/store/user'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', keepAlive: true }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/product/index.vue'),
        meta: { title: '商品列表', keepAlive: true }
      },
      {
        path: 'product/:id',
        name: 'ProductDetail',
        component: () => import('@/views/product/detail.vue'),
        meta: { title: '商品详情', keepAlive: false }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/category/index.vue'),
        meta: { title: '商品分类', keepAlive: true }
      },
      {
        path: 'category/:id',
        name: 'CategoryDetail',
        component: () => import('@/views/category/detail.vue'),
        meta: { title: '分类商品', keepAlive: false }
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/cart/index.vue'),
        meta: { title: '购物车', auth: true, keepAlive: false }
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('@/views/order/checkout.vue'),
        meta: { title: '结算', auth: true, keepAlive: false }
      },
      {
        path: 'community',
        name: 'Community',
        component: () => import('@/views/community/index.vue'),
        meta: { title: '社区', keepAlive: true }
      }
    ]
  },
  {
    path: '/user',
    component: DefaultLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/user/login.vue'),
        meta: { title: '登录', guest: true }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/user/register.vue'),
        meta: { title: '注册', guest: true }
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/views/user/forgot-password.vue'),
        meta: { title: '忘记密码', guest: true }
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/user/profile.vue'),
        meta: { title: '个人中心', auth: true }
      },
      {
        path: 'orders',
        name: 'UserOrders',
        component: () => import('@/views/user/orders.vue'),
        meta: { title: '我的订单', auth: true }
      },
      {
        path: 'favorites',
        name: 'UserFavorites',
        component: () => import('@/views/user/favorites.vue'),
        meta: { title: '我的收藏', auth: true }
      }
    ]
  },
  {
    path: '/order',
    component: DefaultLayout,
    children: [
      {
        path: 'success',
        name: 'OrderSuccess',
        component: () => import('@/views/order/success.vue'),
        meta: { title: '下单成功', auth: true }
      },
      {
        path: 'detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail.vue'),
        meta: { title: '订单详情', auth: true }
      }
    ]
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/search/index.vue'),
    meta: { title: '搜索结果', keepAlive: false }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 宠物商城` : '宠物商城'
  
  const userStore = useUserStore()
  
  if (to.meta.auth && !userStore.isLoggedIn && !userStore.isGuest) {
    ElMessage.warning('请先登录')
    next({
      path: '/user/login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  if (to.meta.guest && userStore.isLoggedIn) {
    next('/')
    return
  }
  
  next()
})

export default router