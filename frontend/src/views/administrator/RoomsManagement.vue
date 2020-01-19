<template>
  <div class="wrapper">
    <el-card>
      <room-form @onSubmit="createNewRoom"></room-form>
    </el-card>
    <spinner action="FETCH_ALL_ROOMS">
        <template v-for="(room, idx) in rooms">
          <room-simple-card :room="room" :key="idx" @onDeleteClick="removeRoom" />
        </template>
    </spinner>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { api } from '@/shared/api'
import { Actions } from '@/shared/Actions'
import { IRoom, IRoomForm } from '@/models/IRoom'

import RoomForm from '@/components/RoomForm.vue'
import RoomSimpleCard from '@/components/RoomSimpleCard.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import Spinner from '@/components/Spinner.vue'

export default Vue.extend({
  name: 'rooms-management',
  components: { RoomForm, RoomSimpleCard, ConfirmationDialog, Spinner },
  computed: {
    ...mapState({
      rooms: 'rooms',
    }),
  },
  mounted() {
    this.$store.dispatch(Actions.FETCH_ALL_ROOMS)
  },
  methods: {
    async createNewRoom(room: IRoomForm) {
      this.$store.dispatch(Actions.CREATE_ROOM, room)
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
