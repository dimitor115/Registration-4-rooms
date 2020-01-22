<template>
     <div class="user">
        <el-popover placement="bottom" width="200" trigger="click">
          <el-avatar
            slot="reference"
            icon="el-icon-user-solid"
            shape="square"
            :size="40"
            :src="$store.state.user.data.picture"
          ></el-avatar>
          <div>
          {{$store.state.user.data.name}}
          <el-button type="danger" @click="logout">Wyloguj</el-button>
          </div>
        </el-popover>
      </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    methods: {
        async logout() {
            const auth2 = (window as any).gapi.auth2.getAuthInstance()
            await auth2.signOut()
            this.$router.push('/login')
        }
    }
})
</script>
<style lang="scss" scoped>
 .user {
    width: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    cursor: pointer;
    .el-avatar:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    }
  }
</style>