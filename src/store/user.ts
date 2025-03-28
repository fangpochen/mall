import { defineStore } from 'pinia';
import { getUserInfo, login, refreshToken } from '@/utils/api';
import { ElMessage } from 'element-plus';

interface UserState {
  token: string;
  tokenHead: string;
  userInfo: any;
  roles: string[];
  loading: boolean;
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    tokenHead: localStorage.getItem('tokenHead') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    roles: [],
    loading: false
  }),
  getters: {
    /**
     * 是否已登录
     * @returns {boolean} 是否已登录
     */
    isLoggedIn: (state) => !!state.token,
    
    /**
     * 获取授权头信息
     * @returns {string} 授权头信息
     */
    getAuthorization: (state) => {
      return state.token ? `${state.tokenHead} ${state.token}` : '';
    }
  },
  actions: {
    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码
     * @returns {Promise} 登录结果
     */
    async loginAction(username: string, password: string): Promise<boolean> {
      try {
        this.loading = true;
        const response = await login(username, password);
        if (response.data) {
          const { token, tokenHead } = response.data;
          this.token = token;
          this.tokenHead = tokenHead;
          
          // 存储到localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('tokenHead', tokenHead);
          
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
     * @returns {Promise} 用户信息
     */
    async getUserInfoAction() {
      try {
        const response = await getUserInfo();
        if (response.data) {
          this.userInfo = response.data;
          // 处理角色信息
          this.roles = response.data.roles || [];
          // 存储到localStorage
          localStorage.setItem('userInfo', JSON.stringify(response.data));
          return response.data;
        }
        return null;
      } catch (error) {
        console.error('获取用户信息失败:', error);
        return null;
      }
    },
    
    /**
     * 退出登录
     */
    logout() {
      this.token = '';
      this.tokenHead = '';
      this.userInfo = {};
      this.roles = [];
      
      // 清除localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('tokenHead');
      localStorage.removeItem('userInfo');
      
      ElMessage.success('退出登录成功');
    },
    
    /**
     * 刷新token
     * @returns {Promise} 刷新结果
     */
    async refreshTokenAction(): Promise<boolean> {
      try {
        const response = await refreshToken();
        if (response.data) {
          const { token, tokenHead } = response.data;
          this.token = token;
          this.tokenHead = tokenHead;
          
          // 存储到localStorage
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