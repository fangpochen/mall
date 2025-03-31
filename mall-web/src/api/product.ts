/**
 * 商品相关API
 */
import request from './index';

/**
 * 商品搜索
 * @param params 搜索参数
 * @returns 商品列表
 */
export function search(params: {
  keyword?: string,
  brandId?: number,
  productCategoryId?: number,
  pageNum?: number,
  pageSize?: number,
  sort?: number
}) {
  return request({
    url: '/product/search',
    method: 'get',
    params
  });
}

/**
 * 获取商品分类
 * @returns 商品分类列表
 */
export function getCategoryTreeList() {
  return request({
    url: '/product/categoryTreeList',
    method: 'get'
  });
}

/**
 * 获取商品详情
 * @param id 商品ID
 * @returns 商品详情
 */
export function getProductDetail(id: number) {
  return request({
    url: `/product/detail/${id}`,
    method: 'get'
  });
}

/**
 * 获取品牌列表
 * @param params 分页参数 {pageSize, pageNum}
 * @returns 品牌列表
 */
export function getBrandList(params: {pageSize?: number, pageNum?: number} = {}) {
  return request({
    url: '/brand/recommendList',
    method: 'get',
    params
  });
}

/**
 * 高级商品搜索
 * @param params 搜索参数
 * @returns 商品列表
 * 
 * 注意: 这是一个模拟API，实际应该使用后端真实接口
 */
export function searchProducts(params: {
  page?: number,
  size?: number,
  sort?: string,
  category?: string,
  petType?: string,
  minPrice?: number,
  maxPrice?: number,
  brand?: string,
  keyword?: string
}) {
  // 将前端的排序选项转换为后端接口所需的格式
  let backendSort = 0;
  if (params.sort) {
    switch (params.sort) {
      case 'default': backendSort = 0; break;
      case 'sales': backendSort = 2; break; // 按销量
      case 'price_asc': backendSort = 3; break; // 价格从低到高
      case 'price_desc': backendSort = 4; break; // 价格从高到低
      case 'rating': backendSort = 0; break; // 默认排序，后端没有对应的评分排序
    }
  }

  // 构建请求参数
  const requestParams = {
    keyword: params.keyword,
    brandId: params.brand ? Number(params.brand) : undefined,
    productCategoryId: params.category ? Number(params.category) : undefined,
    pageNum: params.page || 1,
    pageSize: params.size || 10,
    sort: backendSort
  };

  // 使用后端的搜索接口
  return request({
    url: '/product/search',
    method: 'get',
    params: requestParams
  });
}

export default {
  search,
  getCategoryTreeList,
  getProductDetail,
  getBrandList,
  searchProducts
}; 