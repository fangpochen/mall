<template>
  <el-container class="layout-container">
    <el-header>
      <nav class="nav-container">
        <div class="logo">
          <router-link to="/">宠物商城</router-link>
        </div>
        <div class="nav-links">
          <router-link to="/">首页</router-link>
          <router-link to="/products">商品</router-link>
          <router-link to="/community">社区</router-link>
          <router-link to="/cart">购物车</router-link>
          <router-link to="/orders">订单</router-link>
        </div>
        <div class="user-actions">
          <template v-if="isLoggedIn">
            <el-dropdown>
              <span class="user-info">
                {{ userInfo.username }}
                <el-icon><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <router-link to="/user/profile">个人中心</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link to="/user/pets">宠物档案</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <router-link to="/user/login">登录</router-link>
            <router-link to="/user/register">注册</router-link>
          </template>
        </div>
      </nav>
    </el-header>
    
    <el-main>
      <router-view></router-view>
    </el-main>
    
    <el-footer>
      <div class="footer-content">
        <p>© 2024 宠物商城. All rights reserved.</p>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const isLoggedIn = ref(false)
const userInfo = ref({
  username: ''
})

const handleLogout = () => {
  // TODO: 实现登出逻辑
  isLoggedIn.value = false
  router.push('/user/login')
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.logo a {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  color: #606266;
  text-decoration: none;
  font-size: 16px;
}

.nav-links a:hover {
  color: #409EFF;
}

.user-actions {
  display: flex;
  gap: 20px;
  align-items: center;
}

.user-actions a {
  color: #606266;
  text-decoration: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #606266;
}

.el-footer {
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.footer-content {
  color: #909399;
  font-size: 14px;
}
</style> 