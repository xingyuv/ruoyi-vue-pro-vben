import { VxeCrudSchemas } from '@/hooks/web/useCrudSchemas'
import type { VxeGridProps, VxeGridPropTypes, VxeTablePropTypes } from 'vxe-table'

export type XTableProps<D = any> = VxeGridProps<D> & {
  allSchemas?: VxeCrudSchemas
  treeConfig?: VxeTablePropTypes.TreeConfig // 树形表单配置
  topActionSlots?: boolean // 是否开启表格内顶部操作栏插槽
  isList?: boolean // 是否不带分页的list
  getListApi?: Function // 获取列表接口
  getAllListApi?: Function // 获取全部数据接口 用于 vxe 导出
  deleteApi?: Function // 删除接口
  exportListApi?: Function // 导出接口
  exportName?: string // 导出文件夹名称
  params?: Object // 其他查询参数
  pagination?: boolean | VxeGridPropTypes.PagerConfig
  toolBar?: boolean | VxeGridPropTypes.ToolbarConfig
  afterFetch?: Function
}
export type XColumns = VxeGridPropTypes.Columns

export type VxeTableColumn = {
  field: string
  title?: string
  children?: VxeTableColumn[]
} & Recordable
