<template>
  <room-dynamic-card :room="room" no-reservation>
    <template v-for="(student, idx) in room.students">
      <student-admin-form
        v-if="student._id === studentToEdit"
        :key="'r' + idx"
        :student="student"
        :room-id="room._id"
        editable
        @onCancel="studentToEdit = null"
        @afterEdit="handleEdit"
      />

      <student-filled-admin-form
        v-else
        :key="'r' + idx"
        :student="student"
        :room-id="room._id"
        @onEdit="showEditForm"
      />
    </template>
    <template v-for="(_, idx) in room.size - room.students.length">
      <student-admin-form
        v-if="showStudentForm && idx === 0"
        :key="'e' + idx"
        :room-id="room._id"
        @onCancel="showStudentForm = false"
        @afterAdd="handleAdd"
      />
      <student-filled-admin-form
        v-else
        :key="'e' + idx"
        :room-id="room._id"
        :show-add="idx === 0"
        @onAdd="showStudentForm = true"
      />
    </template>
  </room-dynamic-card>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from '@vue/composition-api'
import RoomDynamicCard from '@/components/in-room-registration/RoomDynamicCard.vue'
import StudentFilledAdminForm from '@/components/admin/StudentFilledAdminForm.vue'
import StudentAdminForm from '@/components/admin/StudentAdminForm.vue'
import { IRoom } from '@/models/IRoom'

export default defineComponent({
  components: {
    RoomDynamicCard,
    StudentFilledAdminForm,
    StudentAdminForm
  },
  props: {
    room: {
      type: Object as PropType<IRoom>,
      required: true
    }
  },
  setup() {
    const studentToEdit = ref(null)
    const showStudentForm = ref(false)

    const showEditForm = (studentId: any) => {
      studentToEdit.value = studentId
    }

    const handleAdd = () => {
      showStudentForm.value = false
    }

    const handleEdit = () => {
      studentToEdit.value = null
    }

    return {
      studentToEdit,
      showStudentForm,
      showEditForm,
      handleAdd,
      handleEdit
    }
  }
})
</script>
