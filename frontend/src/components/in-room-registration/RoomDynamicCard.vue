<template>
  <el-card class="object-card">
    <template slot="header">
      <span @click="expandRoom">{{room.name}}</span>
    </template>
    <reservation-count-down v-if="room.reservedBy" :until="room.reservedUntil"></reservation-count-down>
    <div class="places-container">Miejsca: {{room.students.length}} / {{room.size}}</div>

    <transition name="fade">
      <div v-if="showDetails">

        <template v-for="(student, idx) in room.students">
          <student-filled-form :student="student" :key="'r' + idx" @onRemove="removeStudent"></student-filled-form>
        </template>
        <template v-for="(place, idx) in restPlaces">
          <student-filled-form :key="'e' + idx"></student-filled-form>
        </template>
        

        <student-in-room-form v-if="canRegisterStudents" @onRegister="registerStudent"></student-in-room-form>
        <el-button v-else-if="room.reservedBy" class="reserve-button" disabled @click="reserveRoom" type="primary">Ktoś inny zapisuje teraz do tego pokoju...</el-button>
        <el-button v-else class="reserve-button" @click="reserveRoom" type="primary">Rozpocznij wpisywanie</el-button>
      </div>
    </transition>

    <div class="dynamic-card-footer" @click="expandRoom">
      <template v-if="!showDetails">
        <i class="el-icon-caret-bottom"></i>
        <span class="expand-text">Rozwiń</span>
      </template>
      <template v-else>
        <i class="el-icon-caret-top"></i>
        <span class="expand-text">Zwiń</span>
      </template>
    </div>
  </el-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { IRoom } from '@/models/IRoom'
import { IStudent } from '@/models/IStudent'
import { Actions } from '@/shared/Actions'
import StudentInRoomForm from './StudentInRoomForm.vue'
import StudentFilledForm from './StudentFilledForm.vue'
import ReservationCountDown from './ReservationCountDown.vue'

export default Vue.extend({
  name: 'room-dynamic-card',
  components: { StudentInRoomForm, StudentFilledForm, ReservationCountDown },
  props: {
    room: {
      type: Object as PropType<IRoom>,
      required: true,
    },
  },
  data: () => ({
    showDetails: false,
  }),
  computed: {
    canRegisterStudents(): boolean {
      return this.room.reservedBy === this.$store.state.user.uuid
    },
    restPlaces(): number {
      return this.room.size - this.room.students.length
    },
  },
  methods: {
    registerStudent(student: IStudent) {
      this.$store.dispatch(Actions.REGISTER_STUDENT, {
        roomId: this.room._id,
        student,
      })
    },
    removeStudent(student: IStudent, removedBy: string) {
      this.$store.dispatch(
        Actions.REMOVE_STUDENT, {
        roomId: this.room._id,
        student,
        removedBy,
      })
    },
    expandRoom() {
      this.showDetails = this.showDetails ? false : true
    },
    reserveRoom() {
      this.$store.dispatch(
        Actions.RESERVE_ROOM, {
          roomId: this.room._id,
          userUUID: this.$store.state.user.uuid,
        },
      )
    },
  },
})
</script>
<style lang="scss">
button.reserve-button {
  width: 485px;
  margin-top: 20px;
  margin-right: 58px;
}

.dynamic-card-footer {
  margin: 15px -20px -20px -20px;
  padding: 16px 0 12px 0;
  border-top: 1px solid #ebeef5;
  color: #d3dce6;
  cursor: pointer;
  .expand-text {
    display: none;
  }
  &:hover {
    background-color: #f9fafc;
  }
}

.object-card:hover .dynamic-card-footer {
  color: #1989fa;
  .expand-text {
    display: inline;
    margin-left: 5px;
    font-size: 16px;
  }
}

.places-container{
  padding: 17px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
