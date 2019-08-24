<template>
  <div class="wrapper">
    <el-card>
      <room-form @onSubmit="createNewRoom"></room-form>
    </el-card>
    <spinner action="FEATCH_ALL_ROOMS">
      <template v-for="(room, idx) in rooms">
        <room-simple-card :room="room" :key="idx" @onDeleteClick="removeRoom" />
      </template>
    </spinner>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { api } from "../../shared/api";
import RoomForm from "@/components/RoomForm.vue";
import RoomSimpleCard from "@/components/RoomSimpleCard.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import Spinner from "@/components/Spinner.vue";
import { IRoom, IRoomForm } from "../../models/IRoom";
import { mapState } from "vuex";
import { Actions } from "../../shared/Actions";

export default Vue.extend({
  name: "rooms-managment",
  components: { RoomForm, RoomSimpleCard, ConfirmationDialog, Spinner },
  computed: {
    ...mapState({
      rooms: "rooms"
    })
  },
  mounted() {
    this.$store.dispatch(Actions.FEACH_ALL_ROOMS);
  },
  methods: {
    async createNewRoom(room: IRoomForm) {
      this.$store.dispatch(Actions.CREATE_ROOM, room);
    },
    async removeRoom(id: string) {
      this.$store.dispatch(Actions.CREATE_ROOM, id);
    }
  }
});
</script>
<style>
.wrapper {
  width: 800px;
}
</style>
