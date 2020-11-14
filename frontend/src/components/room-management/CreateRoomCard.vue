<template>
  <el-card>
    <room-form :entry="room">
      <template v-slot:action>
        <el-form-item>
          <el-button type="primary" :loading="isProcessing" @click="handleRoomCreation">
            Dodaj
          </el-button>
        </el-form-item>
      </template>
    </room-form>
  </el-card>
</template>

<script lang="ts">
import RoomForm from '@/components/RoomForm.vue'
import { defineComponent, ref } from '@vue/composition-api'
import { createAction } from '@/components/room-management/RoomActions'
import { CreateRoomRequest } from '@/models/CreateRoomRequest'

export default defineComponent({
  components: { RoomForm },
  setup() {
    const room = ref(new CreateRoomRequest())
    const { isProcessing, create } = createAction()

    const handleRoomCreation = () => {
      create({ ...room.value })
      room.value = new CreateRoomRequest()
    }

    return { room, handleRoomCreation, isProcessing }
  }
})
</script>
