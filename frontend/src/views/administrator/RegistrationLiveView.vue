<template>
  <div class="wrapper live-view">
    <el-card header="Podłączonych użytkowników:">
      <h2>{{ $store.state.clientsCount }}</h2>
    </el-card>
    <el-card header="Procent zapełnionych miejsc:">
      <el-progress type="circle" :percentage="0" />
    </el-card>
    <div class="rooms-header">
      <h2>Stoliki:</h2>
      <div>
        <el-button type="success" @click="exportToExcel">Export</el-button>
      </div>
    </div>
    <spinner :is-loading="isProcessing">
      <template v-for="(room, roomIdx) in rooms">
        <room-admin-card :key="roomIdx" :room="room" />
      </template>
    </spinner>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from '@vue/composition-api'
import { fetchAllAction } from '@/actions/roomActions'
import { rooms } from '@/actions/rootActions'
import { API_URL } from '@/shared/config/consts'

import Spinner from '@/components/Spinner.vue'
import RoomAdminCard from '@/components/admin/RoomAdminCard.vue'
import { connections } from '@/shared/socketApi'

const exportToExcel = () => {
  const link = document.createElement('a')
  link.setAttribute('href', API_URL + '/api/v1/rooms/export')
  link.setAttribute('download', 'stoliki.xlsx')
  link.click()
}

export default defineComponent({
  components: {
    Spinner,
    RoomAdminCard
  },
  setup() {
    const { isProcessing, fetchAll } = fetchAllAction

    onMounted(() => {
      fetchAll()
      connections.roomUpdates.open()
      connections.clientsUpdates.open()
    })

    onUnmounted(() => {
      connections.roomUpdates.close()
      connections.clientsUpdates.close()
    })

    return {
      rooms,
      exportToExcel,
      isProcessing
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
