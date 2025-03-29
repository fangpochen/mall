import { defineStore } from 'pinia';
import { login, getUserInfo, refreshToken, logout } from '@/api/user';
import { ElMessage } from 'element-plus';
import router from '@/router';

// 用户信息接口
export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  icon?: string;
  email?: string;
  phone?: string;
  gender?: number;
  birthday?: string;
  roles?: string[];
  permissions?: string[];
  [key: string]: any;
}

// 用户状态接口
interface UserState {
  token: string;
  tokenHead: string;
  userInfo: UserInfo | null;
  isGuest: boolean;
  loading: boolean;
}

/**
 * 用户状态管理
 */
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    tokenHead: localStorage.getItem('tokenHead') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
    isGuest: localStorage.getItem('guestMode') === 'true',
    loading: false
  }),
  
  getters: {
    // 是否登录
    isLoggedIn: (state): boolean => {
      return !!state.token;
    },
    
    // 获取授权头信息
    authHeader: (state): string => {
      return state.token ? `${state.tokenHead} ${state.token}` : '';
    },
    
    // 获取用户显示名
    displayName: (state): string => {
      if (!state.userInfo) return '访客';
      return state.userInfo.nickname || state.userInfo.username || '用户';
    },
    
    // 判断是否有指定角色
    hasRole: (state) => (role: string): boolean => {
      return state.userInfo?.roles?.includes(role) || false;
    },
    
    // 判断是否有指定权限
    hasPermission: (state) => (permission: string): boolean => {
      return state.userInfo?.permissions?.includes(permission) || false;
    }
  },
  
  actions: {
    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码
     */
    async loginAction(username: string, password: string): Promise<boolean> {
      this.loading = true;
      
      try {
        const res = await login(username, password);
        
        if (res.code === 200 && res.data) {
          const { token, tokenHead } = res.data;
          
          // 保存登录信息
          this.token = token;
          this.tokenHead = tokenHead;
          this.isGuest = false;
          
          // 存储到本地
          localStorage.setItem('token', token);
          localStorage.setItem('tokenHead', tokenHead);
          localStorage.removeItem('guestMode');
          
          // 获取用户信息
          await this.getUserInfoAction();
          
          return true;
        }
        return false;
      } catch (error) {
        console.error('登录失败:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * 获取用户信息
     */
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.token) return null;
      
      try {
        const res = await getUserInfo();
        
        if (res.code === 200 && res.data) {
          this.userInfo = res.data;
          localStorage.setItem('userInfo', JSON.stringify(res.data));
          return res.data;
        }
        
        return null;
      } catch (error) {
        console.error('获取用户信息失败:', error);
        return null;
      }
    },
    
    /**
     * 访客模式登录
     */
    guestLogin(): void {
      this.isGuest = true;
      localStorage.setItem('guestMode', 'true');
      
      // 清除登录信息
      this.token = '';
      this.tokenHead = '';
      this.userInfo = null;
      localStorage.removeItem('token');
      localStorage.removeItem('tokenHead');
      localStorage.removeItem('userInfo');
      
      ElMessage.info('已切换到访客模式');
    },
    
    /**
     * 退出登录
     */
    async logoutAction(): Promise<void> {
      // 如果有token，请求退出登录接口
      if (this.token) {
        try {
          await logout();
        } catch (error) {
          console.error('退出登录失败:', error);
        }
      }
      
      // 清除登录信息
      this.token = '';
      this.tokenHead = '';
      this.userInfo = null;
      this.isGuest = false;
      
      // 清除本地存储
      localStorage.removeItem('token');
      localStorage.removeItem('tokenHead');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('guestMode');
      
      // 跳转到登录页
      router.push('/user/login');
      
      ElMessage.success('已退出登录');
    },
    
    /**
     * 刷新token
     */
    async refreshTokenAction(): Promise<boolean> {
      try {
        const res = await refreshToken();
        
        if (res.code === 200 && res.data) {
          const { token, tokenHead } = res.data;
          
          this.token = token;
          this.tokenHead = tokenHead;
          
          localStorage.setItem('token', token);
          localStorage.setItem('tokenHead', tokenHead);
          
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('刷新token失败:', error);
        return false;
      }
    }
  }
}); 