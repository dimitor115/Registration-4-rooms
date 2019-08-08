<template>
  <div class="wrapper">
    <el-card>
      <room-form @onSubmit="createNewRoom"></room-form>
    </el-card>
    <room-simple-card @click="removeRoom('chuj')" />
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
    createNewRoom(room: IRoomForm){
      api.ROOMS.CREATE(room)
    },
    removeRoom(id:string) {
      api.ROOMS.DELETE(id)
    }
  },
})
</script>
<style>
.wrapper {
  width: 800px;
}
</style>
