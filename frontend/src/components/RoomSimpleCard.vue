<template>
  <el-card class="room-simple-card">
    <template v-if="isEdited">
      <room-form :entry="editableRoom">
        <template v-slot:action>
          <el-form-item>
            <el-button type="success" :loading="isUpdateProcessing" @click="handleRoomEdition">
              Zapisz
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="isEdited = false">Anuluj</el-button>
          </el-form-item>
        </template>
      </room-form>
    </template>

    <template v-else>
      <template slot="header">
        <span>{{ room.name }}</span>
        <span>
          <el-button circle type="primary" icon="el-icon-edit" @click="isEdited = true" />
          <el-button
            circle
            type="danger"
            icon="el-icon-delete"
            :loading="isDeletionProcessing"
            @click="deleteRoom(room._id)"
          />
        </span>
      </template>
      Wolne miejsca: {{ roomFreeSpace }} / {{ room.size }}
    </template>
  </el-card>
</template>

<script lang="ts">
import RoomForm from '@/components/RoomForm.vue'
import { useUpdateRoom, useDeleteRoom } from '@/hooks/room'
import { IRoom } from '@/models/IRoom'
import { computed, defineComponent, PropType, ref } from '@vue/composition-api'
import { CreateRoomRequest } from '@/models/CreateRoomRequest'

export default defineComponent({
  components: { RoomForm },
  props: {
    room: {
      type: Object as PropType<IRoom>,
      required: true
    }
  },
  setup(props) {
    const roomFreeSpace = computed(() => props.room.size - props.room.students.length)
    const isEdited = ref(false)
    const editableRoom = ref(CreateRoomRequest.fromRoom(props.room))

    const { isProcessing: isDeletionProcessing, deleteRoom } = useDeleteRoom()
    const { isProcessing: isUpdateProcessing, updateRoom } = useUpdateRoom()

    const handleRoomEdition = async () => {
      await updateRoom(props.room._id, editableRoom.value)
      isEdited.value = false
    }

    return {
      roomFreeSpace,
      isEdited,
      editableRoom,
      isDeletionProcessing,
      deleteRoom,
      isUpdateProcessing,
      handleRoomEdition
    }
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
