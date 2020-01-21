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
        <el-button type="success" @click="exportToExcel">Export</el-button>
      </div>
    </div>
    <spinner action="FETCH_ALL_ROOMS">
      <template v-for="(room, roomIdx) in rooms">
        <rooms-admin-list :room="room" :key="roomIdx" />
      </template>
    </spinner>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

import { api } from "@/shared/api";
import { SingleActions } from "@/shared/Actions";
import { IRoom, IRoomForm } from "@/models/IRoom";
import { API_URL } from "@/shared/config/consts";

import RoomDynamicCard from "@/components/in-room-registration/RoomDynamicCard.vue";
import StudentFilledAdminForm from "@/components/admin/StudentFilledAdminForm.vue";
import RoomForm from "@/components/RoomForm.vue";
import RoomSimpleCard from "@/components/RoomSimpleCard.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import Spinner from "@/components/Spinner.vue";
import RoomsAdminList from "@/components/admin/RoomsAdminList.vue";
import { connections } from "@/shared/socketApi";

export default Vue.extend({
  name: "RegistrationLiveView",
  components: {
    RoomDynamicCard,
    StudentFilledAdminForm,
    Spinner,
    RoomsAdminList
  },
  mounted() {
    this.$store.dispatch(SingleActions.FETCH_ALL_ROOMS);
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
  },
  methods: {
    exportToExcel() {
      const link = document.createElement("a");
      link.setAttribute("href", API_URL + "/api/v1/rooms/export");
      link.setAttribute("download", "stoliki.xlsx");
      link.click();
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
