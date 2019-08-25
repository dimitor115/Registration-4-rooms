<template>
  <el-card class="object-card">
    <template slot="header">
      <span @click="expandRoom">{{room.name}}</span>
    </template>
    <div @click="expandRoom">Miejsca: {{room.students.length}} / {{room.size}}</div>
    <transition name="fade">
      <div v-if="showDetails">
        <template v-for="(student) in room.students">{{student}}</template>
        <template v-for="(place, idx) in restPlaces">
          <student-in-room-form :key="idx" @onRegister="registerStudent" @onRemove="removeStudent"></student-in-room-form>
        </template>
      </div>
    </transition>
  </el-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { IRoom } from "@/models/IRoom";
import StudentInRoomForm from "./StudentInRoomForm.vue";
import { IStudent } from "../models/IStudent";
import { Actions } from '../shared/Actions';
export default Vue.extend({
  name: "room-dynamic-card",
  components: { StudentInRoomForm },
  props: {
    room: {
      type: Object as PropType<IRoom>,
      required: true
    }
  },
  data: () => ({
    showDetails: false,
    student: {
      name: null,
      index: null,
      addedBy: "chuj"
    }
  }),
  computed: {
    restPlaces(): number {
      return this.room.size - this.room.students.length;
    }
  },
  methods: {
    registerStudent(student: IStudent) {
      this.$store.dispatch(Actions.REGISTER_STUDENT, {roomId: this.room._id, student})
    },
    removeStudent(student: IStudent) {},
    expandRoom() {
      this.showDetails = this.showDetails ? false : true;
    }
  }
});
</script>
<style lang="scss">
.object-card {
  margin: 20px 0;
  background-color: rgb(221, 218, 218);
  .el-card__header {
    padding: 12px 20px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
