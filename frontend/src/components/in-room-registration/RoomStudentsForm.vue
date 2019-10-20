<template>
  <div>
    <template v-for="(student, idx) in room.students">
      <student-filled-form :student="student" :key="'r' + idx" @onRemove="removeStudent" :allowRemoving="true"></student-filled-form>
    </template>
    <template v-for="(place, idx) in restPlaces">
      <student-filled-form :key="'e' + idx"></student-filled-form>
    </template>

    <student-in-room-form v-if="canRegisterStudents" @onRegister="registerStudent"></student-in-room-form>

    <el-button
      v-else-if="room.reservedBy"
      class="reserve-button"
      disabled
      @click="reserveRoom"
      type="primary">
    Ktoś inny zapisuje teraz do tego pokoju...
    </el-button>

    <el-button
      v-else
      class="reserve-button"
      @click="reserveRoom"
      type="primary">
      Rozpocznij wpisywanie
    </el-button>

  </div>
</template>


<script lang="ts">
import Vue, { PropType } from "vue";
import { IRoom } from "@/models/IRoom";
import { IStudent } from "@/models/IStudent";
import { Actions } from "@/shared/Actions";
import StudentInRoomForm from "./StudentInRoomForm.vue";
import StudentFilledForm from "./StudentFilledForm.vue";
import ReservationCountDown from "./ReservationCountDown.vue";

export default Vue.extend({
  name: "room-students-form",
  components: { StudentInRoomForm, StudentFilledForm, ReservationCountDown },
  props: {
    room: {
      type: Object as PropType<IRoom>,
      required: true
    }
  },
  computed: {
    canRegisterStudents(): boolean {
      return this.room.reservedBy === this.$store.state.user.uuid;
    },
    restPlaces(): number {
      return this.room.size - this.room.students.length
    },
  },
  methods: {
    registerStudent(student: IStudent) {
      this.$store.dispatch(Actions.REGISTER_STUDENT, {
        roomId: this.room._id,
        student
      });
    },
    removeStudent(student: IStudent, removedBy: string) {
      this.$store.dispatch(Actions.REMOVE_STUDENT, {
        roomId: this.room._id,
        student,
        removedBy
      });
    },
    reserveRoom() {
      this.$store.dispatch(Actions.RESERVE_ROOM, {
        roomId: this.room._id,
        userUUID: this.$store.state.user.uuid
      });
    }
  }
});
</script>
<style lang="scss">
button.reserve-button {

  margin-top: 20px;
  margin-right: 58px;

  @media only screen and (max-width: 700px) {
        width: 215px;
  }
   width: 485px;
}
</style>
