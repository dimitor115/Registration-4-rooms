<template>
  <div class="wrapper live-view">
    <el-card header="Podłączonych użytkowników:">
      <h2>{{ $store.state.clientsCount }}</h2>
    </el-card>
    <el-card header="Procent zapełnionych miejsc:">
      <el-progress type="circle" :percentage="totalPlacesPercentage" />
    </el-card>
    <div class="rooms-header">
      <h2>Stoliki:</h2>
      <div>
        <el-button type="success" @click="exportToExcel">Export</el-button>
      </div>
    </div>
    <spinner action="FETCH_ALL_ROOMS">
      <template v-for="(room, roomIdx) in rooms">
        <room-admin-card :key="roomIdx" :room="room" />
      </template>
    </spinner>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { SingleActions } from '@/shared/Actions'
import { IRoom } from '@/models/IRoom'
import { API_URL } from '@/shared/config/consts'

import Spinner from '@/components/Spinner.vue'
import RoomAdminCard from '@/components/admin/RoomAdminCard.vue'
import { connections } from '@/shared/socketApi'

export default Vue.extend({
  name: 'RegistrationLiveView',
  components: {
    Spinner,
    RoomAdminCard
  },
  computed: {
    rooms(): Array<IRoom> {
      return this.$store.state.rooms
    },
    totalPlacesPercentage(): number {
      const totalStudents = this.$store.state.rooms
        .map((room: IRoom) => room.students.length)
        .reduce((count: number, acc: number) => acc + count, 0)

      const totalSize = this.$store.state.rooms
        .map((room: IRoom) => room.size)
        .reduce((count: number, acc: number) => acc + count, 0)

      return Math.round((totalStudents / totalSize) * 100) || 0
    }
  },
  mounted() {
    this.$store.dispatch(SingleActions.FETCH_ALL_ROOMS)
    connections.roomUpdates.open()
    connections.clientsUpdates.open()
  },
  beforeDestroy() {
    connections.roomUpdates.close()
    connections.clientsUpdates.close()
  },
  methods: {
    exportToExcel() {
      const link = document.createElement('a')
      link.setAttribute('href', API_URL + '/api/v1/rooms/export')
      link.setAttribute('download', 'stoliki.xlsx')
      link.click()
    }
  }
})
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
