import request from '@/utils/request';

/**
 * 确认订单信息
 * @param cartIds 购物车项ID列表
 * @returns Promise
 */
export function generateConfirmOrder(cartIds: number[]) {
  return request.post('/order/generateConfirmOrder', cartIds);
}

/**
 * 创建订单
 * @param data 订单参数
 * @returns Promise
 */
export function generateOrder(data: any) {
  return request.post('/order/generateOrder', data);
}

/**
 * 支付成功回调
 * @param orderId 订单ID
 * @param payType 支付类型
 * @returns Promise
 */
export function paySuccess(orderId: number, payType: number) {
  return request.post('/order/paySuccess', {}, {
    params: { orderId, payType }
  });
}

/**
 * 取消订单
 * @param orderId 订单ID
 * @returns Promise
 */
export function cancelOrder(orderId: number) {
  return request.post('/order/cancelOrder', {}, {
    params: { orderId }
  });
}

/**
 * 取消用户订单
 * @param orderId 订单ID
 * @returns Promise
 */
export function cancelUserOrder(orderId: number) {
  return request.post('/order/cancelUserOrder', {}, {
    params: { orderId }
  });
}

/**
 * 删除订单
 * @param orderId 订单ID
 * @returns Promise
 */
export function deleteOrder(orderId: number) {
  return request.post('/order/deleteOrder', {}, {
    params: { orderId }
  });
}

/**
 * 确认收货
 * @param orderId 订单ID
 * @returns Promise
 */
export function confirmReceiveOrder(orderId: number) {
  return request.post('/order/confirmReceiveOrder', {}, {
    params: { orderId }
  });
}

/**
 * 获取订单列表
 * @param status 订单状态：-1->全部；0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭
 * @param pageNum 页码
 * @param pageSize 每页数量
 * @returns Promise
 */
export function getOrderList(status: number = -1, pageNum: number = 1, pageSize: number = 5) {
  return request.get('/order/list', {
    status,
    pageNum,
    pageSize
  });
}

/**
 * 获取订单详情
 * @param orderId 订单ID
 * @returns Promise
 */
export function getOrderDetail(orderId: number) {
  return request.get(`/order/detail/${orderId}`);
} 