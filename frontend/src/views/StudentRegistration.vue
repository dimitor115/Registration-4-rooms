<template>
  <div class="wrapper">
    <h2>Pokoje:</h2>
    <spinner action="FETCH_ALL_ROOMS">
      <template v-for="(room, idx) in rooms">
        <room-dynamic-card :room="room" :key="idx">
          <room-students-form :room="room"></room-students-form>
        </room-dynamic-card>
      </template>
    </spinner>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { IResponse } from "@/shared/IResponse";
import { RoomActions } from "@/shared/Actions";
import { IRoom } from "@/models/IRoom";
import { connections } from "@/shared/socketApi";
import Spinner from "@/components/Spinner.vue";
import RoomStudentsForm from "@/components/in-room-registration/RoomStudentsForm.vue";
import RoomDynamicCard from "@/components/in-room-registration/RoomDynamicCard.vue";

export default Vue.extend({
  name: "student-registration",
  components: { RoomDynamicCard, RoomStudentsForm, Spinner },
  computed: {
    ...mapState({
      rooms: "rooms"
    })
  },
  mounted() {
    this.$store.dispatch(RoomActions.FETCH_ALL_ROOMS);
    connections.roomUpdates.open();
    connections.reservationUpdates.open();
  },
  beforeDestroy() {
    connections.roomUpdates.close();
    connections.reservationUpdates.close();
  }
});
</script>
