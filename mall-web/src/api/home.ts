/**
 * 首页相关API
 */
import request from './index';

/**
 * 获取首页内容信息
 * @returns 首页内容信息，包含轮播广告、推荐品牌、秒杀商品、新品推荐、人气推荐、推荐专题
 */
export function getHomeContent() {
  return request({
    url: '/home/content',
    method: 'get'
  });
}

/**
 * 分页获取推荐商品
 * @param params 分页参数 {pageSize, pageNum}
 * @returns 推荐商品列表
 */
export function getRecommendProductList(params: {pageSize?: number, pageNum?: number}) {
  return request({
    url: '/home/recommendProductList',
    method: 'get',
    params
  });
}

/**
 * 获取首页商品分类
 * @param parentId 父级分类ID
 * @returns 商品分类列表
 */
export function getProductCateList(parentId: number) {
  return request({
    url: `/home/productCateList/${parentId}`,
    method: 'get'
  });
}

/**
 * 分页获取人气推荐商品
 * @param params 分页参数 {pageSize, pageNum}
 * @returns 人气推荐商品列表
 */
export function getHotProductList(params: {pageSize?: number, pageNum?: number}) {
  return request({
    url: '/home/hotProductList',
    method: 'get',
    params
  });
}

/**
 * 分页获取新品推荐商品
 * @param params 分页参数 {pageSize, pageNum}
 * @returns 新品推荐商品列表
 */
export function getNewProductList(params: {pageSize?: number, pageNum?: number}) {
  return request({
    url: '/home/newProductList',
    method: 'get',
    params
  });
}

/**
 * 获取专题列表
 * @param params 查询参数 {cateId, pageSize, pageNum}
 * @returns 专题列表
 */
export function getSubjectList(params: {cateId?: number, pageSize?: number, pageNum?: number}) {
  return request({
    url: '/home/subjectList',
    method: 'get',
    params
  });
}

export default {
  getHomeContent,
  getRecommendProductList,
  getProductCateList,
  getHotProductList,
  getNewProductList,
  getSubjectList
}; 