<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="title" @ok="handleSubmit">
    <BasicForm v-if="isForm" @register="registerForm" />
    <Description v-if="!isForm" :data="formData" :schema="allSchemas.detailSchema" />
  </BasicModal>
</template>
<script lang="ts" setup name="DeptModel">
import { ref } from 'vue'
import { BasicModal, useModalInner } from '@/components/Modal'
import { BasicForm, useForm } from '@/components/Form'
import { Description } from '@/components/Description'
import { allSchemas } from './dept.data'
import * as DeptApi from '@/api/system/dept'
import { useI18n } from '@/hooks/web/useI18n'
import { handleTree } from '@/utils/tree'

const { t } = useI18n()

interface Tree {
  id: number
  name: string
  children?: Tree[] | any[]
}

const emit = defineEmits(['success', 'register'])

const isForm = ref(true)
const rowId = ref(0)
const formData = ref({})
const title = ref('')

function initTitle(type: string) {
  title.value = t('action.' + type)
  if (type == 'detail') {
    isForm.value = false
  } else {
    isForm.value = true
  }
}

const [registerForm, { setFieldsValue, resetFields, updateSchema, validate }] = useForm({
  labelWidth: 100,
  baseColProps: { span: 24 },
  schemas: allSchemas.formSchema,
  showActionButtonGroup: false,
  actionColOptions: {
    span: 23
  }
})
const deptOptions = ref() // 树形结构
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  resetFields()
  setModalProps({ confirmLoading: false })
  initTitle(data.type)
  const treeData = await DeptApi.listSimpleDeptApi()

  deptOptions.value = []
  let dept: Tree = { id: 0, name: '顶级部门', children: [] }
  dept.children = handleTree(treeData)
  deptOptions.value.push(dept)
  console.info(deptOptions.value)
  updateSchema({
    field: 'parentId',
    componentProps: { deptOptions }
  })
  if (data.rowId) {
    rowId.value = data.rowId
    const res = await DeptApi.getDeptApi(data.rowId)
    formData.value = res
    setFieldsValue({
      ...res
    })
  }
})

async function handleSubmit() {
  try {
    const values = await validate()
    setModalProps({ confirmLoading: true })
    if (rowId.value != 0) {
      values.id = rowId.value
      await DeptApi.updateDeptApi(values)
    } else {
      await DeptApi.createDeptApi(values)
    }
    closeModal()
    emit('success')
  } finally {
    setModalProps({ confirmLoading: false })
  }
}
</script>
