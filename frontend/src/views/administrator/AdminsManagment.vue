<template>
  <div class="wrapper">
    <spinner action="FETCH_ALL_ADMINS">
      {{admins}}
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
  components: { RoomForm, RoomSimpleCard, ConfirmationDialog, Spinner },
  computed: {
    ...mapState({
      admins: 'admins',
    }),
  },
  mounted() {
    this.$store.dispatch(Actions.FETCH_ALL_ADMINS)
  },
  methods: {
    async createNewRoom(room: IRoomForm) {
      this.$store.dispatch(Actions.CREATE_ROOM, room)
    },
    async removeRoom(id: string) {
      this.$store.dispatch(Actions.DELETE_ROOM, id)
    },
  },
})
</script>
