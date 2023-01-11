<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="title" @ok="handleSubmit">
    <BasicForm v-if="isForm" @register="registerForm" />
    <Description v-if="!isForm" :data="formData" :schema="allSchemas.detailSchema" />
  </BasicModal>
</template>
<script lang="ts" setup name="PostModel">
import { ref } from 'vue'
import { BasicModal, useModalInner } from '@/components/Modal'
import { BasicForm, useForm } from '@/components/Form'
import { Description } from '@/components/Description'
import { allSchemas } from './post.data'
import * as PostApi from '@/api/system/post'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

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
  initTitle(data.type)
  if (data.rowId) {
    rowId.value = data.rowId
    const res = await PostApi.getPostApi(data.rowId)
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
      await PostApi.updatePostApi(values)
    } else {
      await PostApi.createPostApi(values)
    }
    closeModal()
    emit('success')
  } finally {
    setModalProps({ confirmLoading: false })
  }
}
</script>
