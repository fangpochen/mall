import request from '@/utils/request';

/**
 * 用户登录
 * @param username 用户名
 * @param password 密码
 */
export function login(username: string, password: string) {
  return request.post('/sso/login', { username, password });
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request.get('/sso/info');
}

/**
 * 用户注册
 * @param data 注册信息
 */
export function register(data: {
  username: string;
  password: string;
  telephone: string;
  authCode: string;
}) {
  return request.post('/sso/register', data);
}

/**
 * 获取短信验证码
 * @param telephone 手机号
 */
export function getAuthCode(telephone: string) {
  return request.get('/sso/getAuthCode', { telephone });
}

/**
 * 刷新token
 */
export function refreshToken() {
  return request.get('/sso/refreshToken');
}

/**
 * 退出登录
 */
export function logout() {
  return request.post('/sso/logout');
}

/**
 * 更新用户信息
 * @param data 用户信息
 */
export function updateUserInfo(data: any) {
  return request.post('/member/update', data);
}

/**
 * 获取用户订单列表
 * @param params 查询参数
 */
export function getUserOrders(params: any) {
  return request.get('/order/list', params);
}

/**
 * 获取用户购物车列表
 */
export function getCartList() {
  return request.get('/cart/list');
} 