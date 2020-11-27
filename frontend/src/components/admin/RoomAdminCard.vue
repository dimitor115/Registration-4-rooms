<template>
  <room-dynamic-card :room="room" no-reservation>
    <template v-for="(student, idx) in room.students">
      <student-admin-form
        v-if="student._id === studentToEdit"
        :key="'r' + idx"
        :student="student"
        editable
        :is-create-processing="isRegisterProcessing"
        :is-edit-processing="isUpdateProcessing"
        @onCancel="studentToEdit = null"
        @onEdit="handleEdit"
      />

      <student-filled-admin-form
        v-else
        :key="'r' + idx"
        :student="student"
        :room-id="room._id"
        :is-remove-processing="isRemoveProcessing"
        @onRemove="handleRemove"
        @onEdit="showEditForm"
      />
    </template>
    <template v-for="(_, idx) in room.size - room.students.length">
      <student-admin-form
        v-if="showStudentForm && idx === 0"
        :key="'e' + idx"
        :room-id="room._id"
        :is-create-processing="isRegisterProcessing"
        :is-edit-processing="isUpdateProcessing"
        @onCancel="showStudentForm = false"
        @onAdd="handleAdd"
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
import { MessageBox } from 'element-ui'
import RoomDynamicCard from '@/components/in-room-registration/RoomDynamicCard.vue'
import StudentFilledAdminForm from '@/components/admin/StudentFilledAdminForm.vue'
import StudentAdminForm from '@/components/admin/StudentAdminForm.vue'
import { IRoom } from '@/models/IRoom'
import { IStudent } from '@/models/IStudent'
import {
  registerStudentByAdminAction,
  removeStudentByAdmin,
  updateStudentByAdminAction
} from '@/actions/room'

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
  setup(props) {
    const studentToEdit = ref(null)
    const showStudentForm = ref(false)

    const { isProcessing: isRegisterProcessing, register } = registerStudentByAdminAction()
    const { isProcessing: isUpdateProcessing, update } = updateStudentByAdminAction()
    const { isProcessing: isRemoveProcessing, remove } = removeStudentByAdmin()

    const handleRemove = (studentId: string) => {
      MessageBox.confirm(`Jesteś pewnien, że chcesz usunąć uczestnika?`, 'Potwierdzenie', {
        confirmButtonText: 'Tak',
        cancelButtonText: 'Nie',
        type: 'error'
      }).then(() => remove(props.room._id, studentId))
    }

    const showEditForm = (studentId: any) => {
      studentToEdit.value = studentId
    }

    const handleAdd = async (student: IStudent) => {
      await register(student, props.room._id)
      showStudentForm.value = false
    }

    const handleEdit = async (student: IStudent) => {
      await update(student, props.room._id, student._id)
      studentToEdit.value = null
    }

    return {
      studentToEdit,
      showStudentForm,
      handleRemove,
      showEditForm,
      handleAdd,
      handleEdit,
      isRegisterProcessing,
      isUpdateProcessing,
      isRemoveProcessing
    }
  }
})
</script>
