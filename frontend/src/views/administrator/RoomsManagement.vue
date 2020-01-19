<template>
  <div class="wrapper">
    <el-card>
      <room-form @onSubmit="createNewRoom"></room-form>
    </el-card>
    <spinner action="FETCH_ALL_ROOMS">
        <template v-for="(room, idx) in rooms">
          <el-card v-if="roomToEdit === room._id" :key="idx">
            <room-form edit :entry="room" @onCancel="roomToEdit = null" @onSubmit="updateRoom"></room-form>
          </el-card>
          <room-simple-card v-else :room="room" :key="idx" @onDeleteClick="removeRoom" @onEditClick="editRoom"/>
        </template>
    </spinner>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { api } from '@/shared/api'
import { SingleActions, Actions } from '@/shared/Actions'
import { IRoom, IRoomForm } from '@/models/IRoom'

import RoomForm from '@/components/RoomForm.vue'
import RoomSimpleCard from '@/components/RoomSimpleCard.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import Spinner from '@/components/Spinner.vue'

export default Vue.extend({
  name: 'rooms-management',
  components: { RoomForm, RoomSimpleCard, ConfirmationDialog, Spinner },
  data: () => ({
    roomToEdit: null as string | null
  }),
  computed: {
    ...mapState({
      rooms: 'rooms',
    }),
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
       await this.$store.dispatch(Actions.UPDATE_ROOM, {id: this.roomToEdit, payload: room})
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
    },
  },
})
</script>
<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
</style>
