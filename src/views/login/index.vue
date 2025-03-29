<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="/logo.png" alt="宠物商城" class="logo">
        <h1>宠物商城</h1>
      </div>
      
      <el-tabs v-model="activeTab" class="login-tabs">
        <el-tab-pane label="登录" name="login">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
            <el-form-item prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="用户名"
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
              <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
              <el-link type="primary" :underline="false" class="forgot-pwd">忘记密码?</el-link>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" class="login-btn" @click="handleLogin">登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="注册" name="register">
          <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
            <el-form-item prop="username">
              <el-input 
                v-model="registerForm.username" 
                placeholder="用户名"
                prefix-icon="User" 
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input 
                v-model="registerForm.password" 
                type="password" 
                placeholder="密码"
                prefix-icon="Lock" 
                show-password
              />
            </el-form-item>
            <el-form-item prop="telephone">
              <el-input 
                v-model="registerForm.telephone" 
                placeholder="手机号"
                prefix-icon="Phone" 
              />
            </el-form-item>
            <el-form-item prop="authCode" class="auth-code-item">
              <el-input 
                v-model="registerForm.authCode" 
                placeholder="验证码"
                prefix-icon="Message" 
              />
              <el-button 
                type="primary" 
                :disabled="isAuthCodeButtonDisabled" 
                @click="handleGetAuthCode"
              >
                {{ authCodeButtonText }}
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" class="register-btn" @click="handleRegister">注册</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      
      <div class="login-footer">
        <p>© 2024 宠物商城 - 欢迎您的光临</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login, register, getAuthCode } from '@/api/user'
import { useUserStore } from '@/store/user'

// 路由
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 页面状态
const activeTab = ref('login')
const loading = ref(false)
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

const registerForm = reactive({
  username: '',
  password: '',
  telephone: '',
  authCode: ''
})

// 验证码按钮状态
const isAuthCodeButtonDisabled = ref(false)
const authCodeButtonText = ref('获取验证码')
let countDown = 60

// 登录表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 注册表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  telephone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  authCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 6, message: '验证码长度不正确', trigger: 'blur' }
  ]
}

// 验证码倒计时
const startCountDown = () => {
  isAuthCodeButtonDisabled.value = true
  authCodeButtonText.value = `${countDown}秒后重新获取`
  
  const timer = setInterval(() => {
    countDown--
    authCodeButtonText.value = `${countDown}秒后重新获取`
    
    if (countDown <= 0) {
      clearInterval(timer)
      isAuthCodeButtonDisabled.value = false
      authCodeButtonText.value = '获取验证码'
      countDown = 60
    }
  }, 1000)
}

// 获取验证码
const handleGetAuthCode = async () => {
  if (!registerForm.telephone) {
    ElMessage.warning('请先输入手机号')
    return
  }
  
  try {
    const res = await getAuthCode(registerForm.telephone)
    if (res.code === 200) {
      ElMessage.success('验证码已发送')
      startCountDown()
    }
  } catch (error) {
    console.error('获取验证码失败', error)
  }
}

// 登录
const handleLogin = async () => {
  loading.value = true
  try {
    const res = await login(loginForm.username, loginForm.password)
    
    if (res.code === 200) {
      // 保存token信息
      const { token, tokenHead } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('tokenHead', tokenHead)
      
      // 更新用户状态
      await userStore.getUserInfo()
      
      // 登录成功提示
      ElMessage.success('登录成功')
      
      // 跳转页面
      const redirect = route.query.redirect as string || '/'
      router.push(redirect)
    }
  } catch (error) {
    console.error('登录失败', error)
  } finally {
    loading.value = false
  }
}

// 注册
const handleRegister = async () => {
  loading.value = true
  try {
    const res = await register({
      username: registerForm.username,
      password: registerForm.password,
      telephone: registerForm.telephone,
      authCode: registerForm.authCode
    })
    
    if (res.code === 200) {
      ElMessage.success('注册成功，请登录')
      activeTab.value = 'login'
      loginForm.username = registerForm.username
      
      // 清空注册表单
      registerForm.username = ''
      registerForm.password = ''
      registerForm.telephone = ''
      registerForm.authCode = ''
    }
  } catch (error) {
    console.error('注册失败', error)
  } finally {
    loading.value = false
  }
}

// 页面初始化
onMounted(() => {
  // 如果已登录，跳转到首页
  if (localStorage.getItem('token')) {
    router.push('/')
  }
})
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
}

.login-box {
  width: 400px;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.logo {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.login-header h1 {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.login-form, .register-form {
  margin-top: 20px;
}

.login-btn, .register-btn {
  width: 100%;
}

.forgot-pwd {
  float: right;
}

.auth-code-item {
  display: flex;
}

.auth-code-item :deep(.el-input) {
  flex: 1;
  margin-right: 10px;
}

.auth-code-item .el-button {
  width: 120px;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}
</style> 