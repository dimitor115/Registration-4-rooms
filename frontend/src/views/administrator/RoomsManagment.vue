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
import IRoomForm from '../../models/RoomFrom'

export default Vue.extend({
  name: 'object-managment',
  components: { RoomForm, RoomSimpleCard },
  data: () => ({
      rooms: [],
  }),
  methods: {
    async createNewRoom(room: IRoomForm){
      const {data: roomEntity} = await api.ROOMS.CREATE(room)
      this.rooms.push(roomEntity)
    },
    async removeRoom(id:string) {
      await api.ROOMS.DELETE(id)
      this.rooms = this.rooms.filter(x => x._id !== id)
    }
  },
})
</script>
<style>
.wrapper {
  width: 800px;
}
</style>
