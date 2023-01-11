<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm v-if="isForm" @register="registerForm" />
    <Description v-if="!isForm" :column="1" :data="formData" :schema="allSchemas.detailSchema" />
  </BasicModal>
</template>
<script lang="ts" setup name="PostModel">
import { ref, computed, unref } from 'vue'
import { BasicModal, useModalInner } from '@/components/Modal'
import { BasicForm, useForm } from '@/components/Form'
import { Description } from '@/components/Description'
import { allSchemas } from './post.data'
import * as PostApi from '@/api/system/post'

const emit = defineEmits(['success', 'register'])

const isUpdate = ref(true)
const rowId = ref('')
const isForm = ref(true)
const formData = ref({})

const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
  labelWidth: 100,
  baseColProps: { span: 24 },
  schemas: allSchemas.formSchema,
  showActionButtonGroup: false,
  actionColOptions: {
    span: 23
  }
})

const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  resetFields()
  setModalProps({ confirmLoading: false })
  isUpdate.value = !!data?.isUpdate
  isForm.value = !!data?.isForm

  if (unref(isUpdate)) {
    rowId.value = data.rowId
    const res = await PostApi.getPostApi(data.rowId)
    formData.value = res
    setFieldsValue({
      ...res
    })
  }
})

const getTitle = computed(() => (!unref(isUpdate) ? '新增岗位' : '编辑岗位'))

async function handleSubmit() {
  try {
    const values = await validate()
    setModalProps({ confirmLoading: true })
    closeModal()
    emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } })
  } finally {
    setModalProps({ confirmLoading: false })
  }
}
</script>
