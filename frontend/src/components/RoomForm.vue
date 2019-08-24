<template>
  <el-form :inline="true" :model="entry" class="object-form">
    <el-form-item>
      <el-input v-model="entry.name" placeholder="Nazwa"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input-number v-model="entry.size" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit" :loading="isProcessing">Dodaj</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Actions } from '@/shared/Actions'

export default Vue.extend({
  name: 'room-form',
  data: () => ({
    entry: {
      name: null,
      size: 0,
    },
  }),
  computed: {
    isProcessing(): boolean {
      return this.$store.state.isProcessing[Actions.CREATE_ROOM]
    },
  },
  methods: {
    handleSubmit() {
      this.$emit('onSubmit', { ...this.entry })
    },
  },
})
</script>
<style lang="scss">
.object-form > div {
  margin-bottom: 0;
}
</style>
