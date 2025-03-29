<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-form-wrapper">
        <div class="login-header">
          <div class="logo">
            <router-link to="/">宠物商城</router-link>
          </div>
          <h2>欢迎登录</h2>
          <p>还没有账号？<router-link to="/register" class="register-link">立即注册</router-link></p>
        </div>
        
        <el-form 
          ref="loginFormRef" 
          :model="loginForm" 
          :rules="loginRules" 
          class="login-form"
          @submit.prevent="handleLogin"
        >
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
          
          <div class="login-options">
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
            <a href="#" class="forgot-password">忘记密码?</a>
          </div>
          
          <el-form-item>
            <el-button 
              type="primary" 
              class="login-button" 
              :loading="loading" 
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="other-login">
          <div class="divider">
            <span>其他登录方式</span>
          </div>
          <div class="social-login">
            <el-button class="social-button wechat">
              <el-icon><Promotion /></el-icon>
            </el-button>
            <el-button class="social-button qq">
              <el-icon><ChatDotRound /></el-icon>
            </el-button>
            <el-button class="social-button weibo">
              <el-icon><Share /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
      
      <div class="login-banner">
        <img src="https://picsum.photos/600/800?random=10" alt="登录页面宠物图片" />
        <div class="banner-overlay">
          <h2>宠爱无限 • 呵护一生</h2>
          <p>宠物商城，您的宠物用品一站式购物平台</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Promotion, ChatDotRound, Share } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名/手机号/邮箱', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

/**
 * 处理登录逻辑
 * @example
 * handleLogin()
 */
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 这里应该是登录API调用
        // const res = await loginApi(loginForm)
        
        // 模拟登录成功
        setTimeout(() => {
          // 存储登录信息
          localStorage.setItem('token', 'mock_token_123456')
          localStorage.setItem('userName', loginForm.username)
          
          ElMessage.success('登录成功')
          
          // 判断是否有重定向
          const redirect = route.query.redirect as string
          router.push(redirect || '/')
          
          loading.value = false
        }, 1000)
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error('登录失败，请检查用户名和密码')
        loading.value = false
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.login-container {
  width: 900px;
  height: 600px;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.login-form-wrapper {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.login-header {
  margin-bottom: 30px;
  text-align: center;
  
  .logo {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    
    a {
      color: #7e57c2;
      text-decoration: none;
    }
  }
  
  h2 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #333;
  }
  
  p {
    font-size: 14px;
    color: #666;
  }
  
  .register-link {
    color: #7e57c2;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.login-form {
  margin-bottom: 20px;
  
  .el-input {
    --el-input-height: 50px;
  }
  
  .login-options {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    
    .forgot-password {
      color: #7e57c2;
      text-decoration: none;
      font-size: 14px;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .login-button {
    width: 100%;
    height: 50px;
    font-size: 16px;
    background-color: #7e57c2;
    border-color: #7e57c2;
    
    &:hover, &:focus {
      background-color: #6a4caf;
      border-color: #6a4caf;
    }
  }
}

.other-login {
  margin-top: auto;
  
  .divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
    
    &::before, &::after {
      content: '';
      flex: 1;
      height: 1px;
      background-color: #e0e0e0;
    }
    
    span {
      padding: 0 15px;
      font-size: 14px;
      color: #999;
    }
  }
  
  .social-login {
    display: flex;
    justify-content: center;
    gap: 20px;
    
    .social-button {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.wechat {
        background-color: #1aad19;
        border-color: #1aad19;
        color: #fff;
        
        &:hover {
          background-color: #129611;
          border-color: #129611;
        }
      }
      
      &.qq {
        background-color: #12b7f5;
        border-color: #12b7f5;
        color: #fff;
        
        &:hover {
          background-color: #0fa0d9;
          border-color: #0fa0d9;
        }
      }
      
      &.weibo {
        background-color: #e6162d;
        border-color: #e6162d;
        color: #fff;
        
        &:hover {
          background-color: #c9142a;
          border-color: #c9142a;
        }
      }
    }
  }
}

.login-banner {
  width: 50%;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6));
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 40px;
    color: #fff;
    
    h2 {
      font-size: 28px;
      margin-bottom: 10px;
    }
    
    p {
      font-size: 16px;
      opacity: 0.8;
    }
  }
}

@media (max-width: 768px) {
  .login-container {
    width: 100%;
    height: 100%;
    flex-direction: column-reverse;
    border-radius: 0;
  }
  
  .login-banner {
    width: 100%;
    height: 30%;
  }
  
  .login-form-wrapper {
    height: 70%;
  }
}
</style> 