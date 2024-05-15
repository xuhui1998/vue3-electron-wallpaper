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

/** 菜单标签 */
export type IHotTag = {
  tag?: string;
  show_tag?: string;
  icon?: string;
};

/** 分类菜单列表 */
export type CategoryListItem = {
  category?: string;
  show_name?: string;
  icon?: string;
  position?: string;
  hot_tag?: Array<unknown> | Array<IHotTag>;
  old_id?: string;
};

/** 分类菜单接口API */
export interface CategoryListData {
  errno?: number;
  msg?: string;
  data?: Array<CategoryListItem>;
}

/** 菜单详情列表 */
export interface CategoryDetailList {
  id?: string;
  category?: string;
  tag?: string;
  url?: string;
  status?: string;
  live_open?: boolean;
  class_id?: string;
};

/** 分类详情接口API */
export interface CategoryDetailListProps {
  total_count?: number;
  total_page?: number;
  pageno?: number;
  count?: number;
  list?: Array<CategoryDetailList>;
}