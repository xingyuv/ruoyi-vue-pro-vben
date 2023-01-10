import { reactive } from 'vue'
import { useCrudSchemas, VxeCrudSchema } from '@/hooks/web/useCrudSchemas'

const crudSchema = reactive<VxeCrudSchema>({
  primaryKey: 'id',
  primaryType: 'seq',
  primaryTitle: '角色编号',
  action: true,
  columns: [
    { field: 'name', title: '角色名称', isSearch: true },
    { field: 'type', title: '角色类型', isSearch: true },
    { field: 'code', title: '角色标识' },
    { field: 'sort', title: '显示顺序' },
    {
      field: 'status',
      title: '状态',
      search: {
        show: true,
        itemRender: {
          name: '$select',
          options: [
            { label: '启用', value: '0' },
            { label: '停用', value: '1' }
          ]
        }
      },
      form: {
        label: '状态',
        component: 'Select',
        componentProps: {
          options: [
            { label: '启用', value: '0' },
            { label: '停用', value: '1' }
          ]
        }
      }
    },
    { field: 'remark', title: '备注', isTable: false },
    { field: 'createTime', title: '创建时间', isForm: false }
  ]
})

export const { allSchemas } = useCrudSchemas(crudSchema)
