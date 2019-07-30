<template>
  <div class="wrapper">
    <el-card>
      <object-form></object-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ObjectForm from '../../components/ObjectForm.vue';

export default Vue.extend({
  name: 'object-managment',
  components: { ObjectForm },
});
</script>
<style>
.wrapper {
  width: 800px;
}
</style>
