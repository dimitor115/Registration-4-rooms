<template>
  <div class="room-student-form">
    <template v-for="(student, idx) in room.students">
      <student-filled-form
        :key="'r' + idx"
        :student="student"
        :allow-removing="true"
        :room-id="room._id"
      />
    </template>
    <template v-for="(_, idx) in restPlaces">
      <student-filled-form :key="'e' + idx" :room-id="room._id" />
    </template>

    <template v-if="restPlaces > 0">
      <student-in-room-form v-if="canRegisterStudents" :room-id="room._id" />

      <el-button
        v-else-if="room.reservedBy"
        class="reserve-button"
        disabled
        type="primary"
        title="W tym momencie ktoś inny wpisuje uczestników, poczekaj aż on skońćzy albo spróbuj gdzie indziej!"
      >
        Poczekaj chwile...
      </el-button>

      <el-button
        v-else
        class="reserve-button"
        :loading="isReserveProcessing"
        type="primary"
        @click="reserveRoom"
      >
        Rozpocznij wpisywanie
      </el-button>
    </template>
  </div>
</template>

<script lang="ts">
import { IRoom } from '@/models/IRoom'
import StudentInRoomForm from './StudentInRoomForm.vue'
import StudentFilledForm from '@/components/in-room-registration/StudentFilledForm.vue'
import { computed, defineComponent, PropType } from '@vue/composition-api'
import store from '@/store'
import { useReserveRoom } from '@/hooks/room'

export default defineComponent({
  name: 'RoomStudentsForm',
  components: { StudentInRoomForm, StudentFilledForm },
  props: {
    room: {
      type: Object as PropType<IRoom>,
      required: true
    }
  },
  setup(props) {
    const { isProcessing: isReserveProcessing, reserve } = useReserveRoom()

    const restPlaces = computed(() => props.room.size - props.room.students.length)
    const canRegisterStudents = computed(() => props.room.reservedBy === store.state.user.uuid)

    const reserveRoom = () => reserve(props.room._id, store.state.user.uuid)

    return {
      reserveRoom,
      isReserveProcessing,
      restPlaces,
      canRegisterStudents
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
