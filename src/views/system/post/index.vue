<template>
  <PageWrapper>
    <XTable @register="registerTable">
      <template #toolbar_buttons>
        <a-button type="primary" @click="handleModel('create')"> 新增岗位 </a-button>
        <a-button type="warning" class="ml-2" @click="exportList('岗位列表.xls')"> 导出 </a-button>
      </template>
      <template #actionbtns_default="{ row }">
        <a-button
          type="link"
          preIcon="clarity:note-edit-line"
          @click="handleModel('edit', row.id)"
        />
        <a-button type="link" preIcon="ep:view" @click="handleModel('detail', row.id)" />
        <a-button type="link" preIcon="ant-design:delete-outlined" @click="deleteData(row.id)" />
      </template>
    </XTable>
    <PostModel @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script setup lang="ts" name="RoleManagement">
import PostModel from './PostModel.vue'
import { useModal } from '@/components/Modal'
import { PageWrapper } from '@/components/Page'
import { useXTable, XTable } from '@/components/XTable'
import { allSchemas } from './post.data'
import * as PostApi from '@/api/system/post'

const [registerModal, { openModal }] = useModal()
const [registerTable, { reload, deleteData, exportList }] = useXTable({
  allSchemas: allSchemas,
  getListApi: PostApi.getPostPageApi,
  deleteApi: PostApi.deletePostApi,
  exportListApi: PostApi.exportPostApi,
  pagination: true
})

function handleModel(type: string, rowId?: number) {
  openModal(true, {
    rowId,
    type: type
  })
}

function handleSuccess() {
  reload()
}
</script>
