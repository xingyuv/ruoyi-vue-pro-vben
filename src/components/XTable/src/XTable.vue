<template>
  <VxeGrid v-bind="getProps" ref="xGrid" :class="`${prefixCls}`">
    <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </VxeGrid>
</template>
<script lang="ts" setup name="XTable">
import type { XTableProps } from './type'
import { computed, ref, unref, useAttrs, watch } from 'vue'
import { isBoolean, isFunction } from '@/utils/is'
import { SizeType, VxeGridInstance } from 'vxe-table'
import { ThemeEnum } from '@/enums/appEnum'
import { useAppStore } from '@/store/modules/app'
import { useFormats, useInterceptor } from './hooks'
import { useI18n } from '@/hooks/web/useI18n'
import { useDesign } from '@/hooks/web/useDesign'
import { useMessage } from '@/hooks/web/useMessage'
import { downloadByData } from '@/utils/file/download'

useInterceptor()
useFormats()

const { t } = useI18n()
const appStore = useAppStore()
const { createMessage, createConfirm } = useMessage()

const { prefixCls } = useDesign('x-vxe-table')

watch(
  () => appStore.getDarkMode,
  () => {
    if (appStore.getDarkMode == ThemeEnum.DARK) {
      import('./theme/dark.less')
    }
    // //刷新页面重置SCSS
    if (appStore.getDarkMode === ThemeEnum.LIGHT) {
      import('./theme/light.less')
    }
  },
  { immediate: true }
)

const currentSize = computed(() => {
  let resSize: SizeType = 'small'
  const appsize = appStore.getComponentSize
  switch (appsize) {
    case 'middle':
      resSize = 'medium'
      break
    case 'small':
      resSize = 'small'
      break
    case 'small':
      resSize = 'mini'
      break
  }
  return resSize
})
const attrs = useAttrs()
const emit = defineEmits(['register'])
const props = defineProps({
  options: {
    type: Object as PropType<XTableProps>,
    default: () => {}
  }
})
const innerProps = ref<Partial<XTableProps>>()

const getProps = computed(() => {
  const options = innerProps.value || props.options
  options.size = currentSize as any
  options.height = 700
  getColumnsConfig(options)
  getProxyConfig(options)
  getPageConfig(options)
  getToolBarConfig(options)
  // console.log(options);
  return {
    ...options,
    ...attrs
  }
})

const xGrid = ref<VxeGridInstance>() // 列表 Grid Ref

let proxyForm = false

// columns
const getColumnsConfig = (options: XTableProps) => {
  const { allSchemas } = options
  if (!allSchemas) return
  if (allSchemas.printSchema) {
    options.printConfig = {
      columns: allSchemas.printSchema
    }
  }
  if (allSchemas.formSchema) {
    proxyForm = true
    options.formConfig = {
      enabled: true,
      titleWidth: 100,
      titleAlign: 'right',
      items: allSchemas.searchSchema
    }
  }
  if (allSchemas.tableSchema) {
    options.columns = allSchemas.tableSchema
  }
}

// 动态请求
const getProxyConfig = (options: XTableProps) => {
  const { getListApi, proxyConfig, data, isList } = options
  if (proxyConfig || data) return
  if (getListApi && isFunction(getListApi)) {
    if (!isList) {
      options.proxyConfig = {
        seq: true,
        form: proxyForm,
        props: {
          result: 'list', // 配置响应结果列表字段
          total: 'total' // 配置响应结果总页数字段
        },
        ajax: {
          query: async ({ page, form }) => {
            let queryParams: any = Object.assign({}, JSON.parse(JSON.stringify(form)))
            if (options.params) {
              queryParams = Object.assign(queryParams, options.params)
            }
            if (!options?.treeConfig) {
              const { currentPage, pageSize } = page
              queryParams.pageNo = currentPage
              queryParams.pageSize = pageSize
            }
            return new Promise(async (resolve) => {
              resolve(await getListApi(queryParams))
            })
          },
          delete: ({ body }) => {
            return new Promise(async (resolve) => {
              if (options.deleteApi) {
                resolve(await options.deleteApi(JSON.stringify(body)))
              } else {
                Promise.reject('未设置deleteApi')
              }
            })
          }
        }
      }
    } else {
      options.proxyConfig = {
        seq: true, // 启用动态序号代理（分页之后索引自动计算为当前页的起始序号）
        form: true, // 启用表单代理，当点击表单提交按钮时会自动触发 reload 行为
        props: { result: 'data' },
        ajax: {
          query: ({ form }) => {
            let queryParams: any = Object.assign({}, JSON.parse(JSON.stringify(form)))
            if (options?.params) {
              queryParams = Object.assign(queryParams, options.params)
            }
            return new Promise(async (resolve) => {
              resolve(await getListApi(queryParams))
            })
          }
        }
      }
    }
  }
  if (options.exportListApi) {
    options.exportConfig = {
      filename: options?.exportName,
      // 默认选中类型
      type: 'csv',
      // 自定义数据量列表
      modes: options?.getAllListApi ? ['current', 'all'] : ['current'],
      columns: options?.allSchemas?.printSchema
    }
  }
}

// 分页
const getPageConfig = (options: XTableProps) => {
  const { pagination, pagerConfig, treeConfig } = options
  if (treeConfig) {
    options.treeConfig = options.treeConfig
    return
  }
  if (pagerConfig) return
  if (pagination) {
    if (isBoolean(pagination)) {
      options.pagerConfig = {
        border: false, // 带边框
        background: true, // 带背景颜色
        perfect: false, // 配套的样式
        pageSize: 10, // 每页大小
        pagerCount: 7, // 显示页码按钮的数量
        autoHidden: false, // 当只有一页时自动隐藏
        pageSizes: [5, 10, 20, 30, 50, 100], // 每页大小选项列表
        layouts: [
          'PrevJump',
          'PrevPage',
          'JumpNumber',
          'NextPage',
          'NextJump',
          'Sizes',
          'FullJump',
          'Total'
        ]
      }
      return
    }
    options.pagerConfig = pagination
  }
}

// tool bar
const getToolBarConfig = (options: XTableProps) => {
  const { toolBar, toolbarConfig } = options
  if (toolbarConfig) return
  if (toolBar) {
    if (!isBoolean(toolBar)) {
      options.toolbarConfig = toolBar
      return
    }
  } else {
    options.toolbarConfig = {
      slots: { buttons: 'toolbar_buttons' }
    }
  }
}

const reload = () => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  g.commitProxy('query')
}

const getSearchData = () => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  const queryParams = Object.assign({}, JSON.parse(JSON.stringify(g.getProxyInfo()?.form)))
  return queryParams
}

const setProps = (prop: Partial<XTableProps>) => {
  innerProps.value = { ...unref(innerProps), ...prop }
}
// 删除
const deleteData = async (ids: string | number) => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  const options = innerProps.value || props.options
  if (!options.deleteApi) {
    console.error('未传入delListApi')
    return
  }
  return new Promise(async () => {
    createConfirm({
      title: '删除',
      iconType: 'warning',
      content: '是否确认要删除数据？',
      async onOk() {
        await (options?.deleteApi && options?.deleteApi(ids))
        createMessage.success(t('common.delSuccessText'))
        // 刷新列表
        reload()
      }
    })
  })
}

// 导出
const exportList = async (fileName?: string) => {
  const g = unref(xGrid)
  if (!g) {
    return
  }
  const options = innerProps.value || props.options
  if (!options?.exportListApi) {
    console.error('未传入exportListApi')
    return
  }
  const queryParams = Object.assign({}, JSON.parse(JSON.stringify(g.getProxyInfo()?.form)))
  createConfirm({
    title: '导出',
    iconType: 'warning',
    content: '是否要导出数据？',
    async onOk() {
      const res = await (options?.exportListApi && options?.exportListApi(queryParams))
      createMessage.success(t('common.exportSuccessText'))
      // 刷新列表
      downloadByData(res as unknown as Blob, fileName ? fileName : 'excel.xls')
    }
  })
}
defineExpose({ reload, Ref: xGrid, getSearchData, deleteData, exportList })
emit('register', { reload, getSearchData, setProps, deleteData, exportList })
</script>
<style lang="less">
@import url('./theme/index.less');
</style>
