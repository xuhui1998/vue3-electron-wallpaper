import axios, { AxiosRequestConfig } from "axios"
import { WallpaperListData } from '@/types'

export interface WallpaperListParams {
  count: number;
  pageno: number;
}

// 首页360推荐壁纸列表
export const wallpaperList = (params: WallpaperListParams) =>{
	return axios.get<WallpaperListData>("/intf/newestList", { params })
}

// 获取360壁纸所有类目
export const wallpaperSort = (params) =>{
	return axios.get("/intf/getCategory", { params })
}

// 获取360类目详情
export const wallpaperSortDetail = (params) =>{
	return axios.get("/intf/GetListByCategory", { params })
}

// 360壁纸搜索
export const searchWallpaper = (params) =>{
	return axios.get("/intf/search", { params })
}