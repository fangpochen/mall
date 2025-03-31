/**
 * 购物车相关API
 */
import request from './index';

/**
 * 添加商品到购物车
 * @param data 购物车数据
 * @returns 添加结果
 */
export function addToCart(data: any) {
  return request({
    url: '/cart/add',
    method: 'post',
    data
  });
}

/**
 * 获取当前会员的购物车列表
 * @returns 购物车列表
 */
export function getCartList() {
  return request({
    url: '/cart/list',
    method: 'get'
  });
}

/**
 * 获取当前会员的购物车列表(包括促销信息)
 * @param params 查询参数 {cartIds}
 * @returns 包含促销信息的购物车列表
 */
export function getPromotionCartList(params: {cartIds?: number[]}) {
  return request({
    url: '/cart/list/promotion',
    method: 'get',
    params
  });
}

/**
 * 修改购物车中指定商品的数量
 * @param params 参数 {id, quantity}
 * @returns 修改结果
 */
export function updateQuantity(params: {id: number, quantity: number}) {
  return request({
    url: '/cart/update/quantity',
    method: 'get',
    params
  });
}

/**
 * 删除购物车中的指定商品
 * @param data 商品ID列表
 * @returns 删除结果
 */
export function deleteCartItem(data: {ids: number[]}) {
  return request({
    url: '/cart/delete',
    method: 'post',
    params: data
  });
}

/**
 * 清空购物车
 * @returns 清空结果
 */
export function clearCart() {
  return request({
    url: '/cart/clear',
    method: 'post'
  });
}

export default {
  addToCart,
  getCartList,
  getPromotionCartList,
  updateQuantity,
  deleteCartItem,
  clearCart
}; 