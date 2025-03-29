<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">用户登录</h2>
      
      <el-form
        ref="loginForm"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleSubmit"
      >
        <el-form-item prop="username" label="用户名">
          <el-input 
            v-model="form.username" 
            placeholder="用户名/手机号"
            prefix-icon="User"
            autocomplete="username"
          />
        </el-form-item>
        
        <el-form-item prop="password" label="密码">
          <el-input 
            v-model="form.password" 
            type="password" 
            show-password
            prefix-icon="Lock"
            placeholder="请输入密码" 
            autocomplete="current-password"
            @keyup.enter="handleSubmit"
          />
        </el-form-item>
        
        <el-form-item>
          <div class="remember-forgot">
            <el-checkbox v-model="form.remember">记住我</el-checkbox>
            <el-link type="primary" @click="forgotPassword">忘记密码?</el-link>
          </div>
        </el-form-item>
        
        <div class="form-error" v-if="loginError">{{ loginError }}</div>
        
        <el-form-item>
          <el-button 
            type="primary" 
            class="submit-btn" 
            :loading="loading"
            @click="handleSubmit"
          >
            登录
          </el-button>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="info" 
            class="guest-btn" 
            @click="guestLogin"
          >
            访客模式
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="register-link">
        还没有账号? <el-link type="primary" @click="goToRegister">立即注册</el-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import request from '@/utils/request';

const router = useRouter();
const route = useRoute();
const loginForm = ref();
const loading = ref(false);
const loginError = ref('');

// 表单数据
const form = reactive({
  username: localStorage.getItem('rememberUsername') || '',
  password: '',
  remember: Boolean(localStorage.getItem('rememberUsername'))
});

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在3到20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在6到20个字符', trigger: 'blur' }
  ]
};

// 提交登录表单
const handleSubmit = async () => {
  if (!loginForm.value) return;
  
  try {
    await loginForm.value.validate();
    loading.value = true;
    loginError.value = '';
    
    try {
      const res = await request.post('/sso/login', {
        username: form.username,
        password: form.password
      });
      
      if (res.code === 200 && res.data) {
        const { token, tokenHead } = res.data;
        
        // 保存认证信息
        localStorage.setItem('token', token);
        localStorage.setItem('tokenHead', tokenHead);
        
        // 处理"记住我"功能
        if (form.remember) {
          localStorage.setItem('rememberUsername', form.username);
        } else {
          localStorage.removeItem('rememberUsername');
        }
        
        // 获取用户信息并跳转
        await getUserInfo();
        
        // 提示登录成功
        ElMessage.success('登录成功');
        
        // 跳转到来源页面或首页
        const redirect = route.query.redirect as string;
        router.replace(redirect || '/');
      }
    } catch (error: any) {
      console.error('登录失败:', error);
      loginError.value = error.message || '登录失败，请稍后再试';
    }
  } catch (validationError) {
    console.log('表单验证失败', validationError);
  } finally {
    loading.value = false;
  }
};

// 获取用户信息
const getUserInfo = async () => {
  try {
    const res = await request.get('/sso/info');
    if (res.code === 200 && res.data) {
      localStorage.setItem('userInfo', JSON.stringify(res.data));
    }
    return res.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
};

// 访客模式登录
const guestLogin = () => {
  localStorage.setItem('guestMode', 'true');
  ElMessage.info('以访客模式浏览');
  router.push('/');
};

// 忘记密码
const forgotPassword = () => {
  router.push('/user/forgot-password');
};

// 去注册页面
const goToRegister = () => {
  router.push('/user/register');
};

// 检查是否已登录
onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    const redirect = route.query.redirect as string;
    router.replace(redirect || '/');
  }
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submit-btn,
.guest-btn {
  width: 100%;
  margin-bottom: 10px;
  height: 40px;
  font-size: 16px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #606266;
}

.form-error {
  color: #f56c6c;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
}
</style> 