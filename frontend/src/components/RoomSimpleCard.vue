<template>
  <el-card class="room-simple-card">
    <template slot="header">
      <span>{{room.name}}</span>
      <span>
        <i class="el-icon-error remove-icon" @click.prevent="onDelete"></i>
       </span>
    </template>
    Miejsca: {{roomFreeSpace(room)}} / {{room.size}}
  </el-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import {IRoom} from '@/models/IRoom'

export default Vue.extend({
  name: 'room-simple-card',
  props: {
    room: {
      type: Object as PropType<IRoom>,
      required: true,
    },
  },
  methods: {
    roomFreeSpace(room: IRoom) {
      return room.size - room.students.length
    },
    onDelete() {
      this.$emit('onDeleteClick', this.room._id)
    },
  },
})
</script>
<style lang="scss">
.room-simple-card {
  margin: 20px 0;
  .el-card__header {
    display: flex;
    justify-content: space-between;
    padding:12px 20px;
  }
  .remove-icon {
    cursor: pointer;
    &:hover {
      color: rgb(177, 9, 9);
    }
  }
}
</style>
