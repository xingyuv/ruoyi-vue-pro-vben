import { reactive } from 'vue'
import { useCrudSchemas, VxeCrudSchema } from '@/hooks/web/useCrudSchemas'
import { DICT_TYPE } from '@/utils/dict'

// CrudSchema
const crudSchemas = reactive<VxeCrudSchema>({
  primaryKey: 'id',
  primaryType: null,
  action: true,
  columns: [
    {
      title: '上级部门',
      field: 'parentId',
      isTable: false,
      form: {
        component: 'TreeSelect',
        componentProps: {
          showSearch: true,
          treeNodeFilterProp: 'title',
          fieldNames: {
            label: 'name',
            key: 'id',
            value: 'id'
          },
          getPopupContainer: () => document.body
        }
      }
    },
    {
      title: '部门名称',
      field: 'name',
      isSearch: true,
      table: {
        treeNode: true,
        align: 'left'
      }
    },
    {
      title: '负责人',
      field: 'leaderUserId',
      table: {
        slots: {
          default: 'leaderUserId_default'
        }
      }
    },
    {
      title: '联系电话',
      field: 'phone'
    },
    {
      title: '邮箱',
      field: 'email',
      isTable: false
    },
    {
      title: '显示排序',
      field: 'sort'
    },
    {
      title: '状态',
      field: 'status',
      dictType: DICT_TYPE.COMMON_STATUS,
      dictClass: 'number',
      isSearch: true
    },
    {
      title: '创建时间',
      field: 'createTime',
      formatter: 'formatDate',
      isForm: false
    }
  ]
})
export const { allSchemas } = useCrudSchemas(crudSchemas)
