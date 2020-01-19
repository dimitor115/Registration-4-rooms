<template>
  <el-card class="room-simple-card">
    <template slot="header">
      <span @click="expandRoom">{{room.name}}</span>
    </template>
    <reservation-count-down v-if="room.reservedBy" :until="room.reservedUntil" :is-current-user="isCurrentUserReservation"></reservation-count-down>
    <div class="places-container">Miejsca: {{room.students.length}} / {{room.size}}</div>

    <transition name="fade">
      <div v-if="showDetails">
          <slot>
          </slot>
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
    restPlaces(): number {
      return this.room.size - this.room.students.length
    },
    isCurrentUserReservation(): boolean {
      return this.$store.state.user.uuid === this.room.reservedBy
    }
  },
  methods: {
    expandRoom() {
      this.showDetails = this.showDetails ? false : true
    }, 
  },
})
</script>
<style lang="scss">

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

.room-simple-card:hover .dynamic-card-footer {
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
