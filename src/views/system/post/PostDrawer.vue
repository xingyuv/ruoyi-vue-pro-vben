<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script setup lang="ts" name="RoleDrawer">
import { ref, computed, unref } from 'vue'
import { BasicForm, useForm } from '@/components/Form/index'
import { allSchemas } from './post.data'
import { BasicDrawer, useDrawerInner } from '@/components/Drawer'

const emit = defineEmits(['success', 'register'])

const isUpdate = ref(true)

const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
  labelWidth: 90,
  baseColProps: { span: 24 },
  schemas: allSchemas.formSchema,
  showActionButtonGroup: false
})

const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
  resetFields()
  setDrawerProps({ confirmLoading: false })
  // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
  isUpdate.value = !!data?.isUpdate

  if (unref(isUpdate)) {
    setFieldsValue({
      ...data.record
    })
  }
})

const getTitle = computed(() => (!unref(isUpdate) ? '新增岗位' : '编辑岗位'))

async function handleSubmit() {
  try {
    const values = await validate()
    setDrawerProps({ confirmLoading: true })
    // TODO custom api
    console.log(values)
    closeDrawer()
    emit('success')
  } finally {
    setDrawerProps({ confirmLoading: false })
  }
}
</script>
