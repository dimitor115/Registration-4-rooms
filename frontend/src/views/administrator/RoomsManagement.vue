<template>
  <div class="wrapper">
    <el-card>
      <room-form @onSubmit="createNewRoom"></room-form>
    </el-card>
    <spinner action="FEATCH_ALL_ROOMS">
      <transition-group name="list">
        <template v-for="(room, idx) in rooms">
          <room-simple-card :room="room" :key="idx" @onDeleteClick="removeRoom" />
        </template>
      </transition-group>
    </spinner>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { api } from '@/shared/api'
import { Actions, RoomActions } from '@/shared/Actions'
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
    this.$store.dispatch(RoomActions.FEACH_ALL_ROOMS)
  },
  methods: {
    async createNewRoom(room: IRoomForm) {
      this.$store.dispatch(RoomActions.CREATE_ROOM, room)
    },
    async removeRoom(id: string) {
      this.$store.dispatch(RoomActions.DELETE_ROOM, id)
    },
  },
})
</script>
<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
