<template>
  <div class="wrapper">
    <template v-for="(room, idx) in rooms">
      <room-dynamic-card :room="room" :key="idx"></room-dynamic-card>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { IResponse } from "@/shared/IResponse";
import { RoomActions } from "@/shared/Actions";
import { IRoom } from "@/models/IRoom";
import { connections } from "@/shared/socketApi";
import RoomDynamicCard from "@/components/in-room-registration/RoomDynamicCard.vue";

export default Vue.extend({
  name: "student-registration",
  components: { RoomDynamicCard },
  computed: {
    ...mapState({
      rooms: "rooms"
    })
  },
  mounted() {
    this.$store.dispatch(RoomActions.FEACH_ALL_ROOMS);
    connections.roomUpdates.open()
    connections.reservationUpdates.open()
  },
  beforeDestroy() {
    connections.roomUpdates.close()
    connections.reservationUpdates.close()
  }
});
</script>
