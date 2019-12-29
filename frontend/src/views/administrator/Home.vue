<template>
  <div>
    <h1>Logowanie</h1>
      <g-signin-button
      :params="signInParams"
      @success="onSignIn"
      @error="onError">
      Zaloguj przez Google
    </g-signin-button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "home",
  data: () => ({
    signInParams: {
      client_id: '337491963162-1hjps4cha1j7lcotju1nl45ucepjisjn.apps.googleusercontent.com'
    }
  }),
  methods: {
    onSignIn(googleUser: any) {
      const profile = googleUser.getBasicProfile()
      const {id_token} = googleUser.getAuthResponse()
      this.$store.commit('setUserData', {
        googleToken: id_token,
        userData: {
          name: profile.getName(),
          imageUrl: profile.getImageUrl(),
          email: profile.getEmail()
        }
      })
    },
    onError(error: any) {
      console.log(error)
    }
  }
});
</script>
<style>
.g-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #3c82f7;
  color: #fff;
  box-shadow: 0 3px 0 #0f69ff;
  cursor: pointer;
}
</style>
