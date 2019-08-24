<template>
  <div class="wrapper">
    <el-card>
      <room-form @onSubmit="createNewRoom" :is-request-processing="isRequestProcessing.create"></room-form>
    </el-card>
    <spinner :is-loading="isRequestProcessing.fetchAll">
      <template v-for="(room, idx) in rooms">
        <room-simple-card
          :room="room"
          :key="idx"
          @onDeleteClick="removeRoom"
        />
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

export default Vue.extend({
  name: "rooms-managment",
  components: { RoomForm, RoomSimpleCard, ConfirmationDialog, Spinner },
  data: () => ({
    rooms: [] as IRoom[],
    isRequestProcessing: {
      create: false,
      fetchAll: false
    }
  }),
  mounted() {
    this.fetchAllRooms();
  },
  methods: {
    async fetchAllRooms() {
      this.isRequestProcessing.fetchAll = true
      const response = await api.rooms.findAll();
      this.rooms = response.data;
      this.isRequestProcessing.fetchAll = false
    },
    async createNewRoom(room: IRoomForm) {
      this.isRequestProcessing.create = true;
      const response = await api.rooms.create(room);
      this.rooms.push(response.data);
      this.isRequestProcessing.create = false;
    },
    async removeRoom(id: string) {
      await api.rooms.delete(id);
      this.rooms = this.rooms.filter(x => x._id !== id);
    }
  }
});
</script>
<style>
.wrapper {
  width: 800px;
}
</style>
