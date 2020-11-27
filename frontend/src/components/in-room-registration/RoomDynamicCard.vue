<template>
  <el-card class="room-dynamic-card">
    <template slot="header">
      <span @click="expandRoom">{{ room.name }}</span>
    </template>
    <reservation-count-down
      v-if="room.reservedBy && !noReservation"
      :until="room.reservedUntil"
      :is-current-user="isCurrentUserReservation"
    />
    <div class="places-container">
      Wolne miejsca: <b> {{ restPlaces }} </b> / <b>{{ room.size }} </b>
    </div>

    <transition name="fade">
      <div v-if="showDetails">
        <slot />
      </div>
    </transition>

    <div class="dynamic-card-footer" @click="expandRoom">
      <template v-if="!showDetails">
        <i class="el-icon-caret-bottom" />
        <span class="expand-text">Rozwiń</span>
      </template>
      <template v-else>
        <i class="el-icon-caret-top" />
        <span class="expand-text">Zwiń</span>
      </template>
    </div>
  </el-card>
</template>

<script lang="ts">
import store from '@/store'
import { IRoom } from '@/models/IRoom'
import ReservationCountDown from './ReservationCountDown.vue'
import { computed, defineComponent, PropType, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'RoomDynamicCard',
  components: { ReservationCountDown },
  props: {
    room: {
      type: Object as PropType<IRoom>,
      required: true
    },
    noReservation: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  setup({ room }) {
    const showDetails = ref(false)

    const restPlaces = computed(() => room.size - room.students.length)
    const isCurrentUserReservation = computed(() => store.state.user.uuid === room.reservedBy)

    const expandRoom = () => {
      showDetails.value = !showDetails.value
    }

    return {
      showDetails,
      restPlaces,
      isCurrentUserReservation,
      expandRoom
    }
  }
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
@media only screen and (max-width: 370px) {
  .room-dynamic-card.el-card > .el-card__body {
    padding-right: 0;
    padding-left: 0;
  }
}

.room-dynamic-card.el-card > .el-card__header {
  font-weight: bold;
  text-align: left;
}

.room-dynamic-card:hover .dynamic-card-footer {
  color: #1989fa;
  .expand-text {
    display: inline;
    margin-left: 5px;
    font-size: 16px;
  }
}

.places-container {
  padding: 17px;
}
</style>
