<template>
  <div class="login-container">
    <h1 class="title">Logowanie</h1>
    <el-card v-if="!hasToWaitForAccept">
      <el-button id="login-button" type="primary" :loading="isSignInProcessing" @click="isSignInProcessing = true">
        Zaloguj przez Google
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

const CLIENT_ID =
  "337491963162-1hjps4cha1j7lcotju1nl45ucepjisjn.apps.googleusercontent.com";

export default Vue.extend({
  data: () => ({
    isSignInProcessing: false,
    hasToWaitForAccept: false
  }),
  mounted() {
    window.gapi.load("auth", () => {
      const auth2 = window.gapi.auth2.init({
        client_id: CLIENT_ID,
        cookiepolicy: 'single_host_origin'
      })
      auth2.attachClickHandler(
        document.getElementById('login-button'),
        {},
        this.onSignIn,
        this.onError
      )
    })
  },
  methods: {
    onSignIn(googleUser: any) {
      const profile = googleUser.getBasicProfile();
      const { id_token } = googleUser.getAuthResponse();

      setAuthorization(id_token);
      localStorage.setItem("userToken", id_token);
      this.verifyUser();

      this.$store.commit("setUserData", {
        name: profile.getName(),
        picture: profile.getImageUrl(),
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
