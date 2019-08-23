<template>
  <el-card class="object-card">
    <template slot="header">
      <span>{{room.name}}</span>
      <span>
        <i class="el-icon-error remove-icon" @click.prevent="onDelete"></i>
       </span>
    </template>
    Miejsca: {{room.freeSpace}} / {{room.size}}
  </el-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import {IRoom} from '../models/IRoom'

export default Vue.extend({
  name: 'room-simple-card',
  props: {
    room: {
      type: Object as PropType<IRoom>,
      required: true
    }
  },
  methods: {
    onDelete(){
      this.$emit('onDeleteClick', this.room._id)
    }
  }
})
</script>
<style lang="scss">
.object-card {
  width: 300px;
  margin: 20px 0;
  background-color: rgb(221, 218, 218);
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
