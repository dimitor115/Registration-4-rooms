<template>
  <div class="wrapper">
    <h2>Stoliki:</h2>
    <spinner :is-loading="isProcessing">
      <template v-for="(room, idx) in rooms">
        <room-dynamic-card :key="idx" :room="room">
          <room-students-form :room="room" />
        </room-dynamic-card>
      </template>
    </spinner>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from '@vue/composition-api'
import { fetchAllAction, rooms } from '@/actions/room'
import { connections } from '@/shared/socketApi'

import Spinner from '@/components/Spinner.vue'
import RoomStudentsForm from '@/components/in-room-registration/RoomStudentsForm.vue'
import RoomDynamicCard from '@/components/in-room-registration/RoomDynamicCard.vue'

export default defineComponent({
  components: { RoomDynamicCard, RoomStudentsForm, Spinner },
  setup() {
    const { isProcessing, fetchAll } = fetchAllAction
    onMounted(() => {
      fetchAll()
      connections.roomUpdates.open()
      connections.reservationUpdates.open()
    })

    onUnmounted(() => {
      connections.roomUpdates.close()
      connections.reservationUpdates.close()
    })

    return { rooms, isProcessing }
  }
})
</script>
