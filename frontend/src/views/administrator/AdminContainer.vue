<template>
  <div>
    <div class="menu-container">
      <el-menu class="menu" router :default-active="activePage" mode="horizontal">
        <el-menu-item index="live">Zapisy live</el-menu-item>
        <el-menu-item index="zarzadzanie">Zarządzanie pokojami</el-menu-item>
        <el-menu-item index="administratorzy">Zarządzanie administratorami</el-menu-item>
      </el-menu>
      <user-avatar />
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'

export default Vue.extend({
  name: 'AdminContainer',
  components: { UserAvatar },
  computed: {
    activePage() {
      return this.$router.currentRoute.path.split('/').splice(-1)[0]
    }
  }
})
</script>
<style lang="scss" scoped>
.menu-container {
  display: flex;
  justify-content: space-between;
  .menu {
    width: 91%;
  }
}
</style>
