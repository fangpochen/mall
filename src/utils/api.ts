import request from './request';

/**
 * 用户登录
 * @param username 用户名
 * @param password 密码
 * @returns {Promise<any>} 返回登录结果
 * @example
 * login('admin', '123456').then(res => {
 *  // 处理登录成功后的逻辑
 * })
 */
export function login(username: string, password: string) {
  return request({
    url: '/sso/login',
    method: 'post',
    params: {
      username,
      password
    }
  });
}

/**
 * 用户注册
 * @param data 注册信息
 * @returns {Promise<any>} 返回注册结果
 * @example
 * register({
 *   username: 'admin',
 *   password: '123456',
 *   telephone: '13800138000',
 *   authCode: '123456'
 * }).then(res => {
 *   // 处理注册成功后的逻辑
 * })
 */
export function register(data: {
  username: string;
  password: string;
  telephone: string;
  authCode: string;
}) {
  return request({
    url: '/sso/register',
    method: 'post',
    params: data
  });
}

/**
 * 获取验证码
 * @param telephone 手机号
 * @returns {Promise<any>} 返回验证码
 * @example
 * getAuthCode('13800138000').then(res => {
 *  // 处理获取验证码后的逻辑
 * })
 */
export function getAuthCode(telephone: string) {
  return request({
    url: '/sso/getAuthCode',
    method: 'get',
    params: { telephone }
  });
}

/**
 * 修改密码
 * @param data 修改密码信息
 * @returns {Promise<any>} 返回修改结果
 * @example
 * updatePassword({
 *   telephone: '13800138000',
 *   password: '123456',
 *   authCode: '123456'
 * }).then(res => {
 *   // 处理修改密码成功后的逻辑
 * })
 */
export function updatePassword(data: {
  telephone: string;
  password: string;
  authCode: string;
}) {
  return request({
    url: '/sso/updatePassword',
    method: 'post',
    params: data
  });
}

/**
 * 获取用户信息
 * @returns {Promise<any>} 返回用户信息
 * @example
 * getUserInfo().then(res => {
 *   // 处理获取用户信息后的逻辑
 * })
 */
export function getUserInfo() {
  return request({
    url: '/sso/info',
    method: 'get'
  });
}

/**
 * 刷新token
 * @returns {Promise<any>} 返回新的token
 * @example
 * refreshToken().then(res => {
 *   // 处理刷新token后的逻辑
 * })
 */
export function refreshToken() {
  return request({
    url: '/sso/refreshToken',
    method: 'get'
  });
}

/**
 * 获取文章列表
 * @param params 查询参数
 * @returns {Promise<any>} 返回文章列表
 */
export function getArticleList(params: {
  keyword?: string;
  category?: string;
  sortBy?: string;
  page: number;
  pageSize: number;
}) {
  return request({
    url: '/article/list',
    method: 'get',
    params
  });
}

/**
 * 获取文章分类
 * @returns {Promise<any>} 返回分类列表
 */
export function getCategories() {
  return request({
    url: '/article/categories',
    method: 'get'
  });
}

/**
 * 获取文章标签
 * @returns {Promise<any>} 返回标签列表
 */
export function getTags() {
  return request({
    url: '/article/tags',
    method: 'get'
  });
}

/**
 * 获取文章详情
 * @param id 文章ID
 * @returns {Promise<any>} 返回文章详情
 */
export function getArticleDetail(id: string) {
  return request({
    url: `/article/${id}`,
    method: 'get'
  });
}

/**
 * 发布文章
 * @param data 文章数据
 * @returns {Promise<any>} 返回发布结果
 */
export function publishArticle(data: {
  title: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
}) {
  return request({
    url: '/article/publish',
    method: 'post',
    data
  });
}

/**
 * 更新文章
 * @param id 文章ID
 * @param data 文章数据
 * @returns {Promise<any>} 返回更新结果
 */
export function updateArticle(data: {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
}) {
  return request({
    url: `/article/${data.id}`,
    method: 'put',
    data
  });
}

/**
 * 删除文章
 * @param id 文章ID
 * @returns {Promise<any>} 返回删除结果
 */
export function deleteArticle(id: string) {
  return request({
    url: `/article/${id}`,
    method: 'delete'
  });
}

/**
 * 点赞文章
 * @param id 文章ID
 * @returns {Promise<any>} 返回点赞结果
 */
export function likeArticle(id: string) {
  return request({
    url: `/article/${id}/like`,
    method: 'post'
  });
}

/**
 * 获取文章评论
 * @param articleId 文章ID
 * @param params 查询参数
 * @returns {Promise<any>} 返回评论列表
 */
export function getComments(articleId: string, params: {
  page: number;
  pageSize: number;
}) {
  return request({
    url: `/article/${articleId}/comments`,
    method: 'get',
    params
  });
}

/**
 * 发表评论
 * @param articleId 文章ID
 * @param data 评论数据
 * @returns {Promise<any>} 返回评论结果
 */
export function postComment(articleId: string, data: {
  content: string;
  parentId?: string;
}) {
  return request({
    url: `/article/${articleId}/comment`,
    method: 'post',
    data
  });
} 