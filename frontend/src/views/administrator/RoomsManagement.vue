<template>
  <div class="wrapper">
    <create-room-card />
    <spinner :is-loading="isProcessing">
      <template v-for="(room, idx) in rooms">
        <room-simple-card :key="idx" :room="room" />
      </template>
    </spinner>
  </div>
</template>

<script lang="ts">
import { rooms, fetchAllAction } from '@/components/room-management/RoomActions'
import CreateRoomCard from '@/components/room-management/CreateRoomCard.vue'
import RoomSimpleCard from '@/components/RoomSimpleCard.vue'
import Spinner from '@/components/Spinner.vue'
import { defineComponent, onMounted } from '@vue/composition-api'

export default defineComponent({
  components: { RoomSimpleCard, Spinner, CreateRoomCard },
  setup() {
    const { isProcessing, fetchAll } = fetchAllAction()
    onMounted(() => fetchAll())

    return { rooms, isProcessing }
  }
})
</script>