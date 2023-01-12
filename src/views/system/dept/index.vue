<template>
  <PageWrapper>
    <XTable @register="registerTable">
      <template #toolbar_buttons>
        <a-button type="primary" @click="handleModel('create')"> 新增岗位 </a-button>
      </template>
      <template #leaderUserId_default="{ row }">
        <span>{{ userNicknameFormat(row) }}</span>
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
    <DeptModel @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script setup lang="ts" name="Dept">
import { onMounted, ref } from 'vue'
import DeptModel from './DeptModel.vue'
import { useModal } from '@/components/Modal'
import { PageWrapper } from '@/components/Page'
import { useXTable, XTable } from '@/components/XTable'
import { allSchemas } from './dept.data'
import * as DeptApi from '@/api/system/dept'
import { getListSimpleUsersApi, UserVO } from '@/api/system/user'

const treeConfig = {
  transform: true,
  rowField: 'id',
  parentField: 'parentId',
  expandAll: true
}
const [registerModal, { openModal }] = useModal()

const [registerTable, { reload, deleteData }] = useXTable({
  allSchemas: allSchemas,
  treeConfig: treeConfig,
  getListApi: DeptApi.getDeptPageApi,
  deleteApi: DeptApi.deleteDeptApi
})

const userOption = ref<UserVO[]>([])

async function getUserList() {
  const res = await getListSimpleUsersApi()
  userOption.value = res
}

function handleModel(type: string, rowId?: number) {
  openModal(true, {
    rowId,
    type: type
  })
}

function handleSuccess() {
  reload()
}

function userNicknameFormat(row) {
  if (!row || !row.leaderUserId) {
    return '未设置'
  }
  for (const user of userOption.value) {
    if (row.leaderUserId === user.id) {
      return user.nickname
    }
  }
  return '未知【' + row.leaderUserId + '】'
}

// ========== 初始化 ==========
onMounted(async () => {
  await getUserList()
})
</script>
