<template>
  <PageWrapper>
    <XTable @register="registerTable">
      <template #toolbar_buttons>
        <a-button type="primary" @click="handleCreate"> 新增岗位 </a-button>
      </template>
      <template #actionbtns_default="{ row }">
        <a-button type="link" preIcon="clarity:note-edit-line" @click="handleEdit(row)" />
        <a-button type="link" preIcon="ep:view" @click="handleEdit(row)" />
        <a-button type="link" preIcon="ant-design:delete-outlined" @click="handleDelete(row)" />
      </template>
    </XTable>
    <RoleDrawer @register="registerDrawer" @success="handleSuccess" />
  </PageWrapper>
</template>
<script setup lang="ts" name="RoleManagement">
import RoleDrawer from './PostDrawer.vue'
import { useDrawer } from '@/components/Drawer'
import { PageWrapper } from '@/components/Page'
import { useXTable, XTable } from '@/components/XTable'
import { allSchemas } from './post.data'
import * as PostApi from '@/api/system/post'

const [registerDrawer, { openDrawer }] = useDrawer()
const [registerTable, { reload }] = useXTable({
  allSchemas: allSchemas,
  getListApi: PostApi.getPostPageApi,
  deleteApi: PostApi.deletePostApi,
  exportListApi: PostApi.exportPostApi,
  pagination: true
})

function handleCreate() {
  openDrawer(true, {
    isUpdate: false
  })
}

function handleEdit(row: Recordable) {
  openDrawer(true, {
    row,
    isUpdate: true
  })
}

function handleDelete(row: Recordable) {
  console.log(row)
}

function handleSuccess() {
  reload()
}
</script>
