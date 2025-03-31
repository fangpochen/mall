<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-form-wrapper">
        <div class="register-header">
          <div class="logo">
            <router-link to="/">宠物商城</router-link>
          </div>
          <h2>欢迎注册</h2>
          <p>已有账号？<router-link to="/login" class="login-link">立即登录</router-link></p>
        </div>
        
        <el-form 
          ref="registerFormRef" 
          :model="registerForm" 
          :rules="registerRules" 
          class="register-form"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="username">
            <el-input 
              v-model="registerForm.username" 
              placeholder="用户名"
              prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item prop="phone">
            <el-input 
              v-model="registerForm.phone" 
              placeholder="手机号"
              prefix-icon="Phone"
            />
          </el-form-item>
          
          <el-form-item prop="email">
            <el-input 
              v-model="registerForm.email" 
              placeholder="电子邮箱"
              prefix-icon="Message"
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
          
          <el-form-item prop="confirmPassword">
            <el-input 
              v-model="registerForm.confirmPassword" 
              type="password" 
              placeholder="确认密码"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <div class="register-options">
            <el-checkbox v-model="registerForm.agreement">我已阅读并同意<a href="#" class="terms-link">用户协议</a>和<a href="#" class="privacy-link">隐私政策</a></el-checkbox>
          </div>
          
          <el-form-item>
            <el-button 
              type="primary" 
              class="register-button" 
              :loading="loading" 
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <div class="register-banner">
        <img src="https://picsum.photos/600/800?random=20" alt="注册页面宠物图片" />
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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Phone, Message } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const registerFormRef = ref<FormInstance>()
const loading = ref(false)

// 注册表单数据
const registerForm = reactive({
  username: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

// 密码一致性校验
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

// 同意协议校验
const validateAgreement = (rule: any, value: boolean, callback: any) => {
  if (!value) {
    callback(new Error('请阅读并同意用户协议和隐私政策'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的电子邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  agreement: [
    { validator: validateAgreement, trigger: 'change' }
  ]
}

/**
 * 处理注册逻辑
 * @example
 * handleRegister()
 */
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 这里应该是注册API调用
        // const res = await registerApi(registerForm)
        
        // 模拟注册成功
        setTimeout(() => {
          ElMessage.success('注册成功，请登录')
          router.push('/login')
          loading.value = false
        }, 1000)
      } catch (error) {
        console.error('注册失败:', error)
        ElMessage.error('注册失败，请稍后重试')
        loading.value = false
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.register-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.register-container {
  width: 900px;
  height: 700px;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.register-form-wrapper {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.register-header {
  margin-bottom: 20px;
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
  
  .login-link {
    color: #7e57c2;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.register-form {
  margin-bottom: 20px;
  
  .el-input {
    --el-input-height: 50px;
  }
  
  .register-options {
    margin-bottom: 20px;
    
    .terms-link, .privacy-link {
      color: #7e57c2;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .register-button {
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

.register-banner {
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
  .register-container {
    width: 100%;
    height: 100%;
    flex-direction: column-reverse;
    border-radius: 0;
  }
  
  .register-banner {
    width: 100%;
    height: 30%;
  }
  
  .register-form-wrapper {
    height: 70%;
  }
}
</style> 