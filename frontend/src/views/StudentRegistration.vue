<template>
  <div class="wrapper">
    <h2>Pokoje:</h2>
    <spinner action="FETCH_ALL_ROOMS">
      <template v-for="(room, idx) in rooms">
        <room-dynamic-card :key="idx" :room="room">
          <room-students-form :room="room" />
        </room-dynamic-card>
      </template>
    </spinner>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { SingleActions } from '@/shared/Actions'
import { connections } from '@/shared/socketApi'
import Spinner from '@/components/Spinner.vue'
import RoomStudentsForm from '@/components/in-room-registration/RoomStudentsForm.vue'
import RoomDynamicCard from '@/components/in-room-registration/RoomDynamicCard.vue'

export default Vue.extend({
  name: 'StudentRegistration',
  components: { RoomDynamicCard, RoomStudentsForm, Spinner },
  computed: {
    ...mapState({
      rooms: 'rooms'
    })
  },
  mounted() {
    this.$store.dispatch(SingleActions.FETCH_ALL_ROOMS)
    connections.roomUpdates.open()
    connections.reservationUpdates.open()
  },
  beforeDestroy() {
    connections.roomUpdates.close()
    connections.reservationUpdates.close()
  }
})
</script>
