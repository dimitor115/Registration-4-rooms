<template>
  <div class="wrapper live-view">
    <el-card header="Podłączonych użytkowników:">
      <h2>{{ $store.state.clientsCount }}</h2>
    </el-card>
    <el-card header="Procent zapełnionych miejsc:">
      <el-progress type="circle" :percentage="totalPlacesPercentage"></el-progress>
    </el-card>
    <div class="rooms-header">
      <h2>Pokoje:</h2>
      <div>
        <el-button type="success">Export</el-button>
      </div>
    </div>
    <template v-for="(room, idx) in rooms">
      <room-dynamic-card :room="room" :key="idx">

        <template v-for="(student, idx) in room.students">
          <student-filled-form :student="student" :key="'r' + idx"></student-filled-form>
        </template>
        <template v-for="(place, idx) in room.size - room.students.length">
          <student-filled-form :key="'e' + idx"></student-filled-form>
        </template>
      </room-dynamic-card>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

import { api } from "@/shared/api";
import { Actions, RoomActions } from "@/shared/Actions";
import { IRoom, IRoomForm } from "@/models/IRoom";

import RoomDynamicCard from "@/components/in-room-registration/RoomDynamicCard.vue";
import StudentFilledForm from "@/components/in-room-registration/StudentFilledForm.vue";
import RoomForm from "@/components/RoomForm.vue";
import RoomSimpleCard from "@/components/RoomSimpleCard.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import Spinner from "@/components/Spinner.vue";
import { connections } from "@/shared/socketApi";

export default Vue.extend({
  name: "RegistrationLiveView",
  components: { RoomDynamicCard, StudentFilledForm },
  mounted() {
    this.$store.dispatch(RoomActions.FEACH_ALL_ROOMS);
    connections.roomUpdates.open();
    connections.clientsUpdates.open();
  },
  beforeDestroy() {
    connections.roomUpdates.close();
    connections.clientsUpdates.close();
  },
  computed: {
    rooms(): Array<IRoom> {
      return this.$store.state.rooms;
    },
    totalPlacesPercentage(): number {
      const totalStudents = this.$store.state.rooms
        .map((room: IRoom) => room.students.length)
        .reduce((count: number, acc: number) => acc + count, 0);

      const totalSize = this.$store.state.rooms
        .map((room: IRoom) => room.size)
        .reduce((count: number, acc: number) => acc + count, 0);

      return Math.round((totalStudents / totalSize) * 100) || 0;
    }
  }
});
</script>
<style lang="scss">
div.live-view {
  text-align: left;

  .el-card {
    .el-card__header {
      font-weight: bold;
    }
    .el-card__body {
      text-align: center;
    }
  }

  .rooms-header {
    display: flex;
    justify-content: space-between;
    & > div {
      display: flex;
      align-items: center;
    }
  }
}
</style>
