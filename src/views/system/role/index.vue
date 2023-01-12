<template>
  <PageWrapper>
    <XTable @register="registerTable">
      <template #toolbar_buttons>
        <a-button type="primary" @click="handleCreate()"> 新增角色 </a-button>
      </template>
      <template #actionbtns_default="{ row }">
        <a-button type="link" preIcon="clarity:note-edit-line" @click="handleEdit(row.id)" />
        <a-button type="link" preIcon="ep:view" @click="handleEdit(row.id)" />
        <a-button type="link" preIcon="ant-design:delete-outlined" @click="deleteData(row.id)" />
      </template>
    </XTable>
    <RoleModel @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script setup lang="ts" name="Role">
import RoleModel from './RoleModel.vue'
import { useModal } from '@/components/Modal'
import { PageWrapper } from '@/components/Page'
import { useXTable, XTable } from '@/components/XTable'
import { allSchemas } from './role.data'
import * as RoleApi from '@/api/system/role'

const [registerModal, { openModal }] = useModal()
const [registerTable, { reload, deleteData }] = useXTable({
  allSchemas: allSchemas,
  getListApi: RoleApi.getRolePageApi,
  deleteApi: RoleApi.deleteRoleApi,
  pagination: true
})

function handleCreate() {
  openModal(true, {
    isUpdate: false
  })
}

function handleEdit(rowId: number) {
  openModal(true, {
    rowId,
    isUpdate: true
  })
}

function handleSuccess() {
  reload()
}
</script>
