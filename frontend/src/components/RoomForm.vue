<template>
  <el-form :inline="true" :model="entry" class="object-form">
    <el-form-item>
      <el-input v-model="entry.name" placeholder="Nazwa"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input-number v-model="entry.size" :min="1" :max="10"></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit" :loading="isRequestProcessing">Dodaj</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'room-form',
  props: {
    isRequestProcessing: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    entry: {
      name: null,
      size: 0,
    },
  }),
  methods: {
      handleSubmit() {
        this.$emit('onSubmit', {...this.entry})
      },
  },
})
</script>
<style lang="scss">
    .object-form > div {
        margin-bottom: 0;
    }
</style>
