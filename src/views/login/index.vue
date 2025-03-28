<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-logo">
        <router-link to="/">宠物商城</router-link>
      </div>
      <div class="login-form">
        <h2>用户登录</h2>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input 
              v-model="loginForm.username" 
              placeholder="用户名/手机号/邮箱"
              prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="密码"
              prefix-icon="Lock" 
              show-password
            />
          </el-form-item>
          <el-form-item>
            <div class="login-options">
              <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
              <a href="javascript:;" @click="forgotPassword">忘记密码?</a>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-button" @click="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <div class="register-link">
          <span>还没有账号?</span>
          <router-link to="/register">立即注册</router-link>
        </div>
        <div class="other-login">
          <div class="divider">
            <span>其他登录方式</span>
          </div>
          <div class="login-icons">
            <a href="javascript:;" @click="otherLogin('wechat')">
              <i class="social-icon wechat-icon"></i>
            </a>
            <a href="javascript:;" @click="otherLogin('qq')">
              <i class="social-icon qq-icon"></i>
            </a>
            <a href="javascript:;" @click="otherLogin('weibo')">
              <i class="social-icon weibo-icon"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const loginFormRef = ref()

// 登录表单
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 登录处理
const handleLogin = () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 实际登录逻辑
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      return false
    }
  })
}

// 忘记密码
const forgotPassword = () => {
  router.push('/forgot-password')
}

// 第三方登录
const otherLogin = (type: string) => {
  // TODO: 实现第三方登录逻辑
  ElMessage.info(`暂未开放${type}登录`)
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.login-box {
  width: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.login-logo {
  text-align: center;
  margin-bottom: 30px;
}

.login-logo a {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
  text-decoration: none;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
  font-size: 24px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-options a {
  color: #409EFF;
  text-decoration: none;
  font-size: 14px;
}

.login-options a:hover {
  color: #66b1ff;
}

.login-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #606266;
}

.register-link a {
  color: #409EFF;
  text-decoration: none;
  margin-left: 5px;
}

.register-link a:hover {
  color: #66b1ff;
}

.other-login {
  margin-top: 30px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #909399;
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #dcdfe6;
}

.divider span {
  padding: 0 15px;
}

.login-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
}

.login-icons a {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #fff;
  transition: all 0.3s;
}

.social-icon {
  font-size: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.wechat-icon {
  background-color: #09BB07;
}

.qq-icon {
  background-color: #12B7F5;
}

.weibo-icon {
  background-color: #E6162D;
}
</style> 