<template>
  <div class="room-student-form">
    <template v-for="(student, idx) in room.students">
      <student-filled-form
        :key="'r' + idx"
        :student="student"
        :allow-removing="true"
        :room-id="room._id"
        @onRemove="removeStudent"
      />
    </template>
    <template v-for="(_, idx) in restPlaces">
      <student-filled-form :key="'e' + idx" :room-id="room._id" />
    </template>

    <template v-if="restPlaces > 0">
      <student-in-room-form
        v-if="canRegisterStudents"
        :room-id="room._id"
        @onRegister="registerStudent"
      />

      <el-button
        v-else-if="room.reservedBy"
        class="reserve-button"
        disabled
        type="primary"
        title="W tym momencie ktoś inny wpisuje uczestników, poczekaj aż on skońćzy albo spróbuj gdzie indziej!"
        @click="reserveRoom"
      >
        Poczekaj chwile...
      </el-button>

      <el-button
        v-else
        class="reserve-button"
        :loading="isReservationRequestProcessing"
        type="primary"
        @click="reserveRoom"
      >
        Rozpocznij wpisywanie
      </el-button>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { IRoom } from '@/models/IRoom'
import { IStudent } from '@/models/IStudent'
import { Actions } from '@/shared/Actions'
import StudentInRoomForm from './StudentInRoomForm.vue'
import StudentFilledForm from '@/components/in-room-registration/StudentFilledForm.vue'

export default Vue.extend({
  name: 'RoomStudentsForm',
  components: { StudentInRoomForm, StudentFilledForm },
  props: {
    room: {
      type: Object as PropType<IRoom>,
      required: true
    }
  },
  computed: {
    isReservationRequestProcessing(): boolean {
      return this.$store.state.isProcessing[Actions.RESERVE_ROOM][this.room._id]
    },
    canRegisterStudents(): boolean {
      return this.room.reservedBy === this.$store.state.user.uuid
    },
    restPlaces(): number {
      return this.room.size - this.room.students.length
    }
  },
  methods: {
    registerStudent(student: IStudent) {
      this.$store.dispatch(Actions.REGISTER_STUDENT, {
        roomId: this.room._id,
        student
      })
    },
    removeStudent(student: IStudent, removedBy: string) {
      this.$confirm(
              `Jesteś pewnien, że chcesz usunąć uczestnika ${student.name} ${student.surname}?`,
              'Potwierdzenie',
              {
                confirmButtonText: 'Tak',
                cancelButtonText: 'Nie',
                type: 'error'
              }
      ).then(() => {
        this.$store.dispatch(Actions.REMOVE_STUDENT, {
          roomId: this.room._id,
          student,
          removedBy
        })
      })
    },
    reserveRoom() {
      this.$store.dispatch(Actions.RESERVE_ROOM, {
        roomId: this.room._id,
        userUUID: this.$store.state.user.uuid
      })
    }
  }
})
</script>
<style lang="scss">
.room-student-form {
  min-width: 310px;
}
button.reserve-button {
  margin-top: 20px;
  margin-right: 58px;

  @media only screen and (max-width: 700px) {
    width: 63vw;
  }
  width: 485px;
}
</style>
