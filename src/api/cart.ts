import request from '@/utils/request';

/**
 * 购物车项接口
 */
export interface CartItem {
  id: number;
  productId: number;
  productSkuId: number;
  memberId: number;
  quantity: number;
  price: number;
  productPic: string;
  productName: string;
  productSubTitle?: string;
  productSkuCode?: string;
  memberNickname?: string;
  createDate?: string;
  modifyDate?: string;
  deleteStatus?: number;
  productCategoryId?: number;
  productBrand?: string;
  productSn?: string;
  productAttr?: string;
}

/**
 * 购物车促销项接口
 */
export interface CartPromotionItem extends CartItem {
  promotionMessage?: string;
  reduceAmount?: number;
  realStock?: number;
  integration?: number;
  growth?: number;
}

/**
 * 获取购物车列表
 * @returns Promise
 */
export function getCartList() {
  return request.get('/cart/list');
}

/**
 * 获取购物车列表（包含促销信息）
 * @param cartIds 购物车ID列表，可选
 * @returns Promise
 */
export function cartListPromotion(cartIds: number[]) {
  return request.get('/cart/list/promotion', { cartIds });
}

/**
 * 添加商品到购物车
 * @param data 购物车商品信息
 * @returns Promise
 */
export function addCart(data: CartItem) {
  return request.post('/cart/add', data);
}

/**
 * 更新购物车商品数量
 * @param id 购物车项ID
 * @param quantity 数量
 * @returns Promise
 */
export function updateQuantity(id: number, quantity: number) {
  return request.get('/cart/update/quantity', { id, quantity });
}

/**
 * 更新购物车商品规格
 * @param data 购物车商品信息
 * @returns Promise
 */
export function updateAttr(data: CartItem) {
  return request.post('/cart/update/attr', data);
}

/**
 * 删除购物车商品
 * @param ids 购物车项ID列表
 * @returns Promise
 */
export function deleteCartItem(ids: number[]) {
  return request.post('/cart/delete', { ids });
}

/**
 * 清空购物车
 * @returns Promise
 */
export function clear() {
  return request.post('/cart/clear');
}

/**
 * 获取购物车商品规格
 * @param productId 商品ID
 * @returns Promise
 */
export function getCartProduct(productId: number) {
  return request.get(`/cart/getProduct/${productId}`);
} 