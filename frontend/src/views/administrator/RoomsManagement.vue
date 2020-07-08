<template>
  <div class="wrapper">
    <el-card>
      <room-form @onSubmit="createNewRoom" />
    </el-card>
    <spinner action="FETCH_ALL_ROOMS">
      <template v-for="(room, idx) in rooms">
        <el-card v-if="roomToEdit === room._id" :key="idx">
          <room-form edit :entry="room" @onCancel="roomToEdit = null" @onSubmit="updateRoom" />
        </el-card>
        <room-simple-card
          v-else
          :key="idx"
          :room="room"
          @onDeleteClick="removeRoom"
          @onEditClick="editRoom"
        />
      </template>
    </spinner>
  </div>
</template>

<script lang="ts">
import { SingleActions, Actions } from '@/shared/Actions'
import { IRoomForm } from '@/models/IRoom'

import store from '@/store'
import RoomForm from '@/components/RoomForm.vue'
import RoomSimpleCard from '@/components/RoomSimpleCard.vue'
import Spinner from '@/components/Spinner.vue'
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api'

export default defineComponent({
  components: { RoomForm, RoomSimpleCard, Spinner },
  setup(ctx) {
    const roomToEdit = ref<string | null>(null)

    onMounted(() => {
      store.dispatch(SingleActions.FETCH_ALL_ROOMS)
    })
    return {
      rooms: computed(() => store.state.rooms),
      roomToEdit,
      editRoom(id: string) {
        roomToEdit.value = id
      },
      async createNewRoom(room: IRoomForm) {
        return store.dispatch(SingleActions.CREATE_ROOM, room)
      },
      async updateRoom(room: IRoomForm) {
        await store.dispatch(Actions.UPDATE_ROOM, { id: roomToEdit.value, payload: room })
        roomToEdit.value = null
      },
      async removeRoom(id: string) {
        ;(ctx as any)
          .confirm('Jesteś pewnien, że chcesz usunąć ten pokój ?', 'Potwierdzenie', {
            confirmButtonText: 'Tak',
            cancelButtonText: 'Nie',
            type: 'error'
          })
          .then(() => {
            store.dispatch(Actions.DELETE_ROOM, id)
          })
      }
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
