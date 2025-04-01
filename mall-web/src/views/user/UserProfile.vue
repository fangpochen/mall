<template>
  <div class="user-profile">
    <div class="section-header">
      <h2>个人资料</h2>
    </div>
    
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    
    <div v-else class="profile-container">
      <el-form
        ref="formRef"
        :model="userForm"
        :rules="rules"
        label-width="100px"
        class="profile-form"
      >
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" disabled />
          <div class="form-tip">用户名不可修改</div>
        </el-form-item>
        
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="userForm.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
            <el-radio label="保密">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="userForm.birthday"
            type="date"
            placeholder="选择生日"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号码" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        
        <el-form-item label="个人简介" prop="bio">
          <el-input
            v-model="userForm.bio"
            type="textarea"
            rows="4"
            placeholder="介绍一下自己吧"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)">保存修改</el-button>
          <el-button @click="resetForm(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
      
      <div class="account-security">
        <div class="security-title">账号安全</div>
        <div class="security-item">
          <div class="item-left">
            <div class="title">登录密码</div>
            <div class="desc">建议定期更换密码，确保账号安全</div>
          </div>
          <div class="item-right">
            <el-button link @click="showChangePasswordDialog = true">修改</el-button>
          </div>
        </div>
        <div class="security-item">
          <div class="item-left">
            <div class="title">绑定手机</div>
            <div class="desc">{{ userForm.phone ? '已绑定' : '未绑定' }}</div>
          </div>
          <div class="item-right">
            <el-button link @click="showBindPhoneDialog = true">{{ userForm.phone ? '修改' : '绑定' }}</el-button>
          </div>
        </div>
        <div class="security-item">
          <div class="item-left">
            <div class="title">绑定邮箱</div>
            <div class="desc">{{ userForm.email ? '已绑定' : '未绑定' }}</div>
          </div>
          <div class="item-right">
            <el-button link @click="showBindEmailDialog = true">{{ userForm.email ? '修改' : '绑定' }}</el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="showChangePasswordDialog"
      title="修改密码"
      width="400px"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showChangePasswordDialog = false">取消</el-button>
          <el-button type="primary" @click="changePassword(passwordFormRef)">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { getUserInfo, updateUserInfo } from '@/api/user';

// 表单引用
const formRef = ref<FormInstance>();
const passwordFormRef = ref<FormInstance>();

// 加载状态
const loading = ref(true);

// 对话框显示状态
const showChangePasswordDialog = ref(false);
const showBindPhoneDialog = ref(false);
const showBindEmailDialog = ref(false);

// 用户表单数据
const userForm = reactive({
  username: '',
  nickname: '',
  gender: '保密',
  birthday: '',
  phone: '',
  email: '',
  bio: ''
});

// 密码表单数据
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 表单验证规则
const rules = reactive<FormRules>({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
});

// 密码表单验证规则
const passwordRules = reactive<FormRules>({
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});

/**
 * 获取用户信息
 * @example
 * fetchUserInfo()
 */
const fetchUserInfo = async () => {
  loading.value = true;
  try {
    const res = await getUserInfo();
    const { username, nickname, gender, birthday, phone, email, bio } = res.data;
    Object.assign(userForm, {
      username,
      nickname: nickname || '',
      gender: gender || '保密',
      birthday: birthday || '',
      phone: phone || '',
      email: email || '',
      bio: bio || ''
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    ElMessage.error('获取用户信息失败');
  } finally {
    loading.value = false;
  }
};

/**
 * 提交个人资料表单
 * @param formEl 表单实例
 * @example
 * submitForm(formRef)
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        const { nickname, gender, birthday, phone, email, bio } = userForm;
        await updateUserInfo({
          nickname,
          gender,
          birthday,
          phone,
          email,
          bio
        });
        ElMessage.success('个人资料更新成功');
      } catch (error) {
        console.error('更新个人资料失败:', error);
        ElMessage.error('更新个人资料失败');
      }
    }
  });
};

/**
 * 重置表单
 * @param formEl 表单实例
 * @example
 * resetForm(formRef)
 */
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  fetchUserInfo();
};

/**
 * 修改密码
 * @param formEl 表单实例
 * @example
 * changePassword(passwordFormRef)
 */
const changePassword = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        // 这里应该调用修改密码的API
        console.log('修改密码:', passwordForm);
        ElMessage.success('密码修改成功');
        showChangePasswordDialog.value = false;
        // 重置密码表单
        passwordForm.oldPassword = '';
        passwordForm.newPassword = '';
        passwordForm.confirmPassword = '';
      } catch (error) {
        console.error('修改密码失败:', error);
        ElMessage.error('修改密码失败');
      }
    }
  });
};

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo();
});
</script>

<style lang="scss" scoped>
.user-profile {
  padding: 20px;
  
  .section-header {
    margin-bottom: 20px;
    
    h2 {
      font-size: 18px;
      font-weight: 500;
      margin: 0;
    }
  }
  
  .loading-container {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .profile-container {
    display: flex;
    gap: 30px;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
    
    .profile-form {
      flex: 1;
      max-width: 600px;
      
      .form-tip {
        font-size: 12px;
        color: #909399;
        margin-top: 5px;
      }
    }
    
    .account-security {
      width: 300px;
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
      
      @media (max-width: 768px) {
        width: 100%;
      }
      
      .security-title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
      
      .security-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid #eee;
        
        &:last-child {
          border-bottom: none;
        }
        
        .item-left {
          .title {
            font-size: 14px;
            margin-bottom: 5px;
          }
          
          .desc {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
  }
}
</style> 