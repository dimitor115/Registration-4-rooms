<template>
  <div class="login-container">
    <h1 class="title">Logowanie</h1>
    <el-card v-if="!hasToWaitForAccept">
      <el-button type="primary" :loading="isSignInProcessing" @click="isSignInProcessing = true">
        <g-signin-button
          :params="signInParams"
          @success="onSignIn"
          @error="onError"
        >Zaloguj przez Google</g-signin-button>
      </el-button>
    </el-card>

    <el-alert
      v-if="hasToWaitForAccept"
      title="Nie masz jeszcze dostępu do systemu. Twoja prośba musi zostać zaakceptowana przez któregoś z administratorów."
      type="warning"
      :closable="false"
      effect="dark"
    ></el-alert>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { api, setAuthorization } from "@/shared/api";

export default Vue.extend({
  data: () => ({
    signInParams: {
      client_id:
        "337491963162-1hjps4cha1j7lcotju1nl45ucepjisjn.apps.googleusercontent.com"
    },
    isSignInProcessing: false,
    hasToWaitForAccept: false
  }),
  methods: {
    onSignIn(googleUser: any) {
      const profile = googleUser.getBasicProfile();
      const { id_token } = googleUser.getAuthResponse();

      setAuthorization(id_token);
      localStorage.setItem("userToken", id_token);
      this.verifyUser();

      this.$store.commit("setUserData", {
        name: profile.getName(),
        imageUrl: profile.getImageUrl(),
        email: profile.getEmail()
      });
    },
    onError(error: any) {
      console.log(error);
    },
    async verifyUser() {
      try {
        const result = await api.admins.verifyAndCreate();
        this.isSignInProcessing = false;

        if (result.status === 201) {
          this.hasToWaitForAccept = true;
          return;
        }

        if (result.status === 200) {
          this.$router.push("/admin");
        }
      } catch {
        this.hasToWaitForAccept = true;
        throw {};
      }
    }
  }
});
</script>
<style lang="scss" scoped>
.login-container {
  width: 500px;

  .title {
    margin-bottom: 80px;
  }
}
</style>
