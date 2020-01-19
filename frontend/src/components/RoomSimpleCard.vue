<template>
  <el-card class="room-simple-card">
    <template slot="header">
      <span>{{room.name}}</span>
      <span>
        <el-button circle type="primary" icon="el-icon-edit" @click="$emit('onEditClick', room._id)"></el-button>
        <el-button circle type="danger" icon="el-icon-delete" @click="$emit('onDeleteClick', room._id)"></el-button>
       </span>
    </template>
    Wolne miejsca: {{roomFreeSpace(room)}} / {{room.size}}
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
    }
  },
})
</script>
<style lang="scss">
.el-card.room-simple-card {
  margin: 20px 0;
  .el-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:8px 20px;
  }
}
</style>
