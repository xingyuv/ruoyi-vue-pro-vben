<template>
  <Tag :color="dictData?.cssClass">{{ dictData?.label }}</Tag>
</template>
<script setup lang="ts" name="DictTag">
import { onMounted, onUpdated, PropType, ref } from 'vue'
import { getDictOptions, DictDataType } from '@/utils/dict'
import { Tag } from 'ant-design-vue'

const props = defineProps({
  type: {
    type: String as PropType<string>,
    required: true
  },
  value: {
    type: [String, Number, Boolean] as PropType<string | number | boolean>,
    required: true
  }
})
const dictData = ref<DictDataType>()
const getDictObj = (dictType: string, value: string) => {
  const dictOptions = getDictOptions(dictType)
  dictOptions.forEach((dict: DictDataType) => {
    if (dict.value === value) {
      dictData.value = dict
    }
  })
}

onMounted(() => {
  return getDictObj(props.type, props.value?.toString())
})

onUpdated(() => {
  getDictObj(props.type, props.value?.toString())
})
</script>
