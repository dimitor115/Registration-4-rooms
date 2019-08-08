<template>
  <el-card class="object-card">
    <template slot="header">
      <span>Pokój 5A</span>
      <span>x</span>
    </template>
    Miejsca: 0 / 14
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'object-simple-card',
})
</script>
<style lang="scss">
.object-card {
  width: 300px;
  margin: 20px 0;
  background-color: rgb(221, 218, 218);
  .el-card__header {
    display: flex;
    justify-content: space-between;
    padding:12px 20px;
  }
}
</style>
