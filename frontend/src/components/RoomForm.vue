<template>
  <el-form :inline="true" :model="entry" class="object-form">
    <el-form-item>
      <el-input v-model="entry.name" placeholder="Nazwa" />
    </el-form-item>
    <el-form-item>
      <el-input-number v-model="entry.size" :min="1" />
    </el-form-item>
    <el-form-item>
      <el-button
        :type="edit ? 'success' : 'primary'"
        :loading="isProcessing"
        @click="handleSubmit"
        >{{ edit ? 'Zapisz' : 'Dodaj' }}</el-button
      >
    </el-form-item>
    <el-form-item>
      <el-button v-if="edit" type="danger" @click="$emit('onCancel')">Anuluj</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { SingleActions, Actions } from '@/shared/Actions'

export default Vue.extend({
  name: 'RoomForm',
  props: {
    edit: {
      type: [Boolean] as PropType<boolean>,
      default: false
    },
    entry: {
      type: [Object] as PropType<any>,
      default: () => ({
        name: null as string | null,
        size: 0 as number | null
      })
    }
  },
  computed: {
    isProcessing(): boolean {
      return this.edit
        ? this.$store.state.isProcessing[Actions.UPDATE_ROOM][this.entry._id]
        : this.$store.state.isProcessing[SingleActions.CREATE_ROOM]
    }
  },
  methods: {
    handleSubmit() {
      const { name, size } = this.entry
      this.$emit('onSubmit', { name, size })
      this.entry.name = null
      this.entry.size = 0
    }
  }
})
</script>
<style lang="scss">
.object-form > div {
  margin-bottom: 0;
}
</style>
