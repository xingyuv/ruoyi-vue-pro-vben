import { reactive } from 'vue'
import { useCrudSchemas, VxeCrudSchema } from '@/hooks/web/useCrudSchemas'
import { DICT_TYPE } from '@/utils/dict'

const crudSchema = reactive<VxeCrudSchema>({
  primaryKey: 'id',
  primaryType: 'seq',
  primaryTitle: '岗位编号',
  action: true,
  columns: [
    { field: 'name', title: '岗位名称', isSearch: true },
    { field: 'code', title: '岗位编码', isSearch: true },
    { field: 'sort', title: '岗位顺序' },
    {
      field: 'status',
      title: '状态',
      dictType: DICT_TYPE.COMMON_STATUS,
      dictClass: 'number',
      isSearch: true
    },
    { field: 'remark', title: '备注', isTable: false },
    { field: 'createTime', title: '创建时间', formatter: 'formatDate', isForm: false }
  ]
})

export const { allSchemas } = useCrudSchemas(crudSchema)
