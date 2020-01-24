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
import Vue from 'vue'
import { mapState } from 'vuex'

import { SingleActions, Actions } from '@/shared/Actions'
import { IRoomForm } from '@/models/IRoom'

import RoomForm from '@/components/RoomForm.vue'
import RoomSimpleCard from '@/components/RoomSimpleCard.vue'
import Spinner from '@/components/Spinner.vue'

export default Vue.extend({
  name: 'RoomsManagement',
  components: { RoomForm, RoomSimpleCard, Spinner },
  data: () => ({
    roomToEdit: null as string | null
  }),
  computed: {
    ...mapState({
      rooms: 'rooms'
    })
  },
  mounted() {
    this.$store.dispatch(SingleActions.FETCH_ALL_ROOMS)
  },
  methods: {
    editRoom(id: string) {
      this.roomToEdit = id
    },
    async createNewRoom(room: IRoomForm) {
      this.$store.dispatch(SingleActions.CREATE_ROOM, room)
    },
    async updateRoom(room: IRoomForm) {
      await this.$store.dispatch(Actions.UPDATE_ROOM, { id: this.roomToEdit, payload: room })
      this.roomToEdit = null
    },
    async removeRoom(id: string) {
      this.$confirm('Jesteś pewnien, że chcesz usunąć ten pokój ?', 'Potwierdzenie', {
        confirmButtonText: 'Tak',
        cancelButtonText: 'Nie',
        type: 'error'
      }).then(() => {
        this.$store.dispatch(Actions.DELETE_ROOM, id)
      })
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
