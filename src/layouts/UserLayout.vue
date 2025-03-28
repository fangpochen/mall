<template>
  <div class="user-layout">
    <div class="user-container">
      <div class="user-header">
        <router-link to="/" class="logo">宠物商城</router-link>
      </div>
      <div class="user-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 用户布局组件
</script>

<style scoped>
.user-layout {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.user-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
  text-decoration: none;
}

.user-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 40px;
  margin: 0 auto;
  max-width: 500px;
}
</style> 