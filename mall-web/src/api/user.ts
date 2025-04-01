/**
 * 用户相关API
 */
import request from './index';
import { CommonResult } from './index.d';

/**
 * 用户登录
 * @param data 登录数据
 * @example
 * login({username: 'admin', password: '123456'})
 * @returns 登录结果，包含token
 */
export function login(data: {username: string, password: string}) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  });
}

/**
 * 用户注册
 * @param data 注册数据
 * @example
 * register({username: 'user1', password: '123456', phone: '13800138000', email: 'user1@example.com'})
 * @returns 注册结果
 */
export function register(data: {
  username: string, 
  password: string, 
  phone?: string, 
  email?: string,
  code?: string
}) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  });
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  });
}

/**
 * 更新用户信息
 * @param data 用户信息
 * @example
 * updateUserInfo({nickname: '新昵称', gender: '男', birthday: '1990-01-01'})
 * @returns 更新结果
 */
export function updateUserInfo(data: {
  nickname?: string,
  gender?: string,
  birthday?: string,
  phone?: string,
  email?: string,
  avatar?: string
}) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  });
}

/**
 * 获取用户收藏列表
 * @param params 查询参数
 * @example
 * getFavoriteList({pageNum: 1, pageSize: 10})
 * @returns 收藏列表
 */
export function getFavoriteList(params: {pageNum: number, pageSize: number}) {
  return request({
    url: '/favorite/list',
    method: 'get',
    params
  });
}

/**
 * 添加商品到收藏夹
 * @param data 收藏商品信息
 * @example
 * addFavorite({productId: 1, productName: '商品名称', productPic: '商品图片', productPrice: 100})
 * @returns 添加结果
 */
export function addFavorite(data: {
  productId: number,
  productName?: string,
  productPic?: string,
  productPrice?: number
}) {
  return request({
    url: '/favorite/add',
    method: 'post',
    data
  });
}

/**
 * 检查商品是否已收藏
 * @param productId 商品ID
 * @returns 是否已收藏
 */
export function checkFavorite(productId: number) {
  return request({
    url: '/favorite/check',
    method: 'get',
    params: { productId }
  });
}

/**
 * 从收藏夹删除商品
 * @param data 商品ID列表
 * @example
 * deleteFavorite({ids: [1, 2, 3]})
 * @returns 删除结果
 */
export function deleteFavorite(data: {ids: number[]}) {
  return request({
    url: '/favorite/delete',
    method: 'post',
    data
  });
}

export default {
  login,
  register,
  getUserInfo,
  updateUserInfo,
  getFavoriteList,
  addFavorite,
  checkFavorite,
  deleteFavorite
}; 