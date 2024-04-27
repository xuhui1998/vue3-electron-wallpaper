export interface WallpaperListItem {
  id: string; // 图片ID
  category: string; // 分类
  tags: string; // 标签
  url: string; // 图片地址
}

export interface WallpaperListData {
  total_count: number; // 总条数
  total_page: number; // 总页数
  pageno: number; // 当前页
  count: number; // 每页条数
  list: WallpaperListItem[];
}