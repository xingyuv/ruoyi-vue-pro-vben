import { defHttp } from '@/utils/http/axios'

export interface DeptVO {
  id?: number
  name: string
  parentId: number
  status: number
  sort: number
  leaderUserId: number
  phone: string
  email: string
  createTime: Date
}

export interface DeptPageReqVO {
  name?: string
  status?: number
}

// 查询部门（精简)列表
export const listSimpleDeptApi = async () => {
  return defHttp.get({ url: '/system/dept/list-all-simple' })
}

// 查询部门列表
export const getDeptPageApi = async (params: DeptPageReqVO) => {
  return defHttp.get({ url: '/system/dept/list', params })
}

// 查询部门详情
export const getDeptApi = async (id: number) => {
  return defHttp.get({ url: '/system/dept/get?id=' + id })
}

// 新增部门
export const createDeptApi = async (data: DeptVO) => {
  return defHttp.post({ url: '/system/dept/create', data: data })
}

// 修改部门
export const updateDeptApi = async (params: DeptVO) => {
  return defHttp.put({ url: '/system/dept/update', data: params })
}

// 删除部门
export const deleteDeptApi = async (id: number) => {
  return defHttp.delete({ url: '/system/dept/delete?id=' + id })
}
