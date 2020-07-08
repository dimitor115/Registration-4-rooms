<template>
  <el-card class="room-simple-card">
    <template slot="header">
      <span>{{ room.name }}</span>
      <span>
        <el-button
          circle
          type="primary"
          icon="el-icon-edit"
          @click="$emit('onEditClick', room._id)"
        />
        <el-button
          circle
          type="danger"
          icon="el-icon-delete"
          @click="$emit('onDeleteClick', room._id)"
        />
      </span>
    </template>
    Wolne miejsca: {{ roomFreeSpace }} / {{ room.size }}
  </el-card>
</template>

<script lang="ts">
import { IRoom } from '@/models/IRoom'
import { computed, defineComponent, PropType } from '@vue/composition-api'

export default defineComponent({
  props: {
    room: {
      type: Object as PropType<IRoom>,
      required: true
    }
  },
  setup(props) {
    const roomFreeSpace = computed(() => props.room.size - props.room.students.length)
    return { roomFreeSpace }
  }
})
</script>
<style lang="scss">
.el-card.room-simple-card {
  margin: 20px 0;
  .el-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 20px;
  }
}
</style>
