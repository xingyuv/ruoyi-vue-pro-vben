import { defHttp } from '@/utils/http/axios'
import type { DictTypeVO, DictTypePageReqVO, DictTypeExportReqVO } from './types'

// 查询字典（精简)列表
export const listSimpleDictTypeApi = () => {
  return defHttp.get({ url: '/system/dict-type/list-all-simple' })
}

// 查询字典列表
export const getDictTypePageApi = (params: DictTypePageReqVO) => {
  return defHttp.get({ url: '/system/dict-type/page', params })
}

// 查询字典详情
export const getDictTypeApi = (id: number) => {
  return defHttp.get({ url: '/system/dict-type/get?id=' + id })
}

// 新增字典
export const createDictTypeApi = (data: DictTypeVO) => {
  return defHttp.post({ url: '/system/dict-type/create', data })
}

// 修改字典
export const updateDictTypeApi = (data: DictTypeVO) => {
  return defHttp.put({ url: '/system/dict-type/update', data })
}

// 删除字典
export const deleteDictTypeApi = (id: number) => {
  return defHttp.delete({ url: '/system/dict-type/delete?id=' + id })
}
// 导出字典类型
export const exportDictTypeApi = (params: DictTypeExportReqVO) => {
  return defHttp.get({ url: '/system/dict-type/export', params })
}
