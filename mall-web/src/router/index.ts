import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/HomePage.vue'),
        meta: { title: '首页', requiresAuth: false }
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('@/views/product/ProductList.vue'),
        meta: { title: '商品列表', requiresAuth: false }
      },
      {
        path: 'product/:id',
        name: 'productDetail',
        component: () => import('@/views/product/ProductDetail.vue'),
        meta: { title: '商品详情', requiresAuth: false }
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('@/views/cart/ShoppingCart.vue'),
        meta: { title: '购物车', requiresAuth: true }
      },
      /* 
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/order/OrderList.vue'),
        meta: { title: '我的订单', requiresAuth: true }
      },
      */
      {
        path: 'community',
        name: 'community',
        component: () => import('@/views/community/CommunityIndex.vue'),
        meta: { title: '社区论坛', requiresAuth: false }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/UserCenter.vue'),
        meta: { title: '个人中心', requiresAuth: true },
        children: [
          {
            path: 'profile',
            name: 'profile',
            component: () => import('@/views/user/UserProfile.vue'),
            meta: { title: '个人资料', requiresAuth: true }
          },
          {
            path: 'pet',
            name: 'pet',
            component: () => import('@/views/user/PetProfile.vue'),
            meta: { title: '宠物档案', requiresAuth: true }
          },
          {
            path: 'favorites',
            name: 'favorites',
            component: () => import('@/views/user/UserFavorites.vue'),
            meta: { title: '我的收藏', requiresAuth: true }
          },
          {
            path: 'messages',
            name: 'messages',
            component: () => import('@/views/user/UserMessages.vue'),
            meta: { title: '我的消息', requiresAuth: true }
          },
          {
            path: 'address',
            name: 'address',
            component: () => import('@/views/user/UserAddress.vue'),
            meta: { title: '收货地址', requiresAuth: true }
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginPage.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterPage.vue'),
    meta: { title: '注册', requiresAuth: false }
  },
  /* 404页面文件不存在，暂时注释掉此路由
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/common/NotFound.vue'),
    meta: { title: '404', requiresAuth: false }
  }
  */
  
  // 临时重定向
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 简化导航守卫，暂时不检查权限
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '商品详情'} - 宠物商城`
  next()
})

export default router 