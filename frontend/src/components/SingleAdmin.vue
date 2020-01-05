<template>
  <div class="single-admin">
    <el-avatar
      class="avatar"
      icon="el-icon-user-solid"
      shape="square"
      :size="40"
      :src="admin.picture"
    ></el-avatar>

    <div class="admin-name">
      <h3>{{admin.name}}</h3>
    </div>

    <div class="buttons">
        <el-button
        v-if="isAcceptable"
        type="success"
        icon="el-icon-check"
        circle
        @click.prevent="$emit('onAdminAccept', admin.email)"
      ></el-button>
      <el-button
        v-if="admin.email !== 'dimitor115@gmail.com'"
        type="danger"
        icon="el-icon-delete"
        circle
        @click.prevent="$emit('onAdminRemove', admin.email)"
      ></el-button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import { Admin } from "@/models/Admin";
export default Vue.extend({
  props: {
    admin: Object as PropType<Admin>,
    isAcceptable: Boolean as PropType<boolean>
  }
});
</script>
<style lang="scss" scoped>
.single-admin {
  display: flex;
  align-items: center;
  
  .admin-name {
      flex-grow: 2;
      padding-left: 30px;
      text-align: left;
  }
}
</style>