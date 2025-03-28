import request from '@/utils/request'
import type { ProductInfo } from './product'

export interface BannerInfo {
  id: number
  imgUrl: string
  link: string
  sort: number
}

export interface CategoryInfo {
  id: number
  name: string
  iconClass: string
  sort: number
}

/**
 * 获取首页轮播图列表
 * @returns Promise
 */
export function getBannerList() {
  return request({
    url: '/home/banner/list',
    method: 'get'
  })
}

/**
 * 获取首页分类列表
 * @returns Promise
 */
export function getCategoryList() {
  return request({
    url: '/home/category/list',
    method: 'get'
  })
}

/**
 * 获取推荐商品列表
 * @returns Promise
 */
export function getRecommendProducts() {
  return request({
    url: '/home/recommend/products',
    method: 'get'
  })
}

/**
 * 获取新品推荐列表
 * @returns Promise
 */
export function getNewProducts() {
  return request({
    url: '/home/new/products',
    method: 'get'
  })
}

/**
 * 获取人气推荐列表
 * @returns Promise
 */
export function getHotProducts() {
  return request({
    url: '/home/hot/products',
    method: 'get'
  })
} 