<template>
  <div>
      <template v-for="(room, idx) in rooms">
          <room-dynamic-card :room="room" :key="idx">
          </room-dynamic-card>
      </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IRoom } from '@/models/IRoom'
import RoomDynamicCard from './RoomDynamicCard.vue'
import { IResponse } from '@/shared/IResponse'
import { mapState } from 'vuex'
import { Actions } from '@/shared/Actions'


export default Vue.extend({
  name: 'dynamic-rooms-list',
  components: {RoomDynamicCard},
  computed: {
    ...mapState({
      rooms: 'rooms',
    }),
  },
  mounted() {
    this.$store.dispatch(Actions.FEACH_ALL_ROOMS)
  },
})
</script>
