<template>
  <div class="wrapper">
    <el-card>
      <h2>{{ $store.state.clientsCount }}</h2>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

import { api } from "@/shared/api";
import { Actions, RoomActions } from "@/shared/Actions";
import { IRoom, IRoomForm } from "@/models/IRoom";

import RoomForm from "@/components/RoomForm.vue";
import RoomSimpleCard from "@/components/RoomSimpleCard.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import Spinner from "@/components/Spinner.vue";
import { connections } from "@/shared/socketApi";

export default Vue.extend({
  name: "RegistrationLiveView",
  mounted() {
    this.$store.dispatch(RoomActions.FEACH_ALL_ROOMS);
    connections.roomUpdates.open();
    connections.clientsUpdates.open();
  }
});
</script>
<style>
</style>
