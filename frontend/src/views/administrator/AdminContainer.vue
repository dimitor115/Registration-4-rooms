<template>
  <div class="wrapper">
    <el-menu
      router
      :default-active="activePage"
      mode="horizontal"
    >
      <el-menu-item index="live">Zapisy live</el-menu-item>
      <el-menu-item index="zarzadzanie">Zarządzanie pokojami</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "AdminContainer",
  computed: {
      activePage() {
        return this.$router.currentRoute.path.split('/').splice(-1)[0]
      }
  }
});
</script>
