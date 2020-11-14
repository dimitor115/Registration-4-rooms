<template>
  <el-form :inline="true" :model="entry" class="object-form">
    <el-form-item>
      <el-input v-model="entry.name" placeholder="Nazwa" />
    </el-form-item>
    <el-form-item>
      <el-input-number v-model="entry.size" :min="1" />
    </el-form-item>
    <slot name="action" />
  </el-form>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import { IRoomForm } from '@/models/IRoom'

export default defineComponent({
  props: {
    entry: {
      type: Object as PropType<IRoomForm>,
      default: (): IRoomForm => ({
        name: '',
        size: 0,
        _id: '' //FIXME !
      })
    }
  }
})
</script>
<style lang="scss">
.object-form > div {
  margin-bottom: 0;
}
</style>
