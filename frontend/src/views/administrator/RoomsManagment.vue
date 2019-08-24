<template>
  <div class="wrapper">
    <el-card>
      <room-form @onSubmit="createNewRoom"></room-form>
    </el-card>
    <template v-for="(room, idx) in rooms">
     <room-simple-card :room="room" :key="idx" @onDeleteClick="removeRoom"/>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {api} from '../../shared/api'
import RoomForm from '@/components/RoomForm.vue'
import RoomSimpleCard from '@/components/RoomSimpleCard.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import {IRoom, IRoomForm} from '../../models/IRoom'

export default Vue.extend({
  name: 'object-managment',
  components: { RoomForm, RoomSimpleCard, ConfirmationDialog },
  data: () => ({
      rooms: [] as IRoom[],
  }),
  mounted() {
    this.fetchAllRooms()
  },
  methods: {
    async fetchAllRooms() {
      const response = await api.rooms.findAll()
      this.rooms = response.data
    },
    async createNewRoom(room: IRoomForm) {
      const response = await api.rooms.create(room)
      this.rooms.push(response.data)
    },
    async removeRoom(id: string) {
      await api.rooms.delete(id)
      this.rooms = this.rooms.filter((x) => x._id !== id)
    },
  },
})
</script>
<style>
.wrapper {
  width: 800px;
}
</style>
