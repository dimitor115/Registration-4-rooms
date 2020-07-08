<template>
  <div class="wrapper">
    <create-room-card />
    <spinner action="FETCH_ALL_ROOMS">
      <template v-for="(room, idx) in rooms">
        <room-simple-card :key="idx" :room="room" />
      </template>
    </spinner>
  </div>
</template>

<script lang="ts">
import { SingleActions, Actions } from '@/shared/Actions'
import { IRoomForm } from '@/models/IRoom'

import store from '@/store'
import CreateRoomCard from '@/components/room-management/CreateRoomCard.vue'
import RoomForm from '@/components/RoomForm.vue'
import RoomSimpleCard from '@/components/RoomSimpleCard.vue'
import Spinner from '@/components/Spinner.vue'
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api'

export default defineComponent({
  components: { RoomForm, RoomSimpleCard, Spinner, CreateRoomCard },
  setup() {
    onMounted(() => {
      store.dispatch(SingleActions.FETCH_ALL_ROOMS)
    })
    return {
      rooms: computed(() => store.state.rooms)
    }
  }
})
</script>
<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
</style>
