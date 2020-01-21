<template>
  <room-dynamic-card :room="room" no-reservation>
    <template v-for="(student, idx) in room.students">
       <student-admin-form
        v-if="student._id === studentToEdit"
        :room-id="room._id"
        :student="student"
        :key="'r' + idx"
        editable
        @onCancel="studentToEdit = null"
        @onEdit="handleEdit"
      />

      <student-filled-admin-form
        v-else
        :student="student"
        :room-id="room._id"
        :key="'r' + idx"
        @onRemove="handleRemove"
        @onEdit="showEditForm"
      />
    </template>
    <template v-for="(place, idx) in room.size - room.students.length">
      <student-admin-form
        v-if="showStudentForm && idx === 0"
        :room-id="room._id"
        :key="'e' + idx"
        @onCancel="showStudentForm = false"
        @onAdd="handleAdd"
      />
      <student-filled-admin-form
        v-else
        :room-id="room._id"
        :key="'e' + idx"
        @onAdd="showStudentForm = true"
      />
    </template>
  </room-dynamic-card>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";

import Spinner from "@/components/Spinner.vue";
import RoomDynamicCard from "@/components/in-room-registration/RoomDynamicCard.vue";
import StudentFilledAdminForm from "@/components/admin/StudentFilledAdminForm.vue";
import StudentAdminForm from "@/components/admin/StudentAdminForm.vue";
import { Actions } from "@/shared/Actions";
import { IRoom } from "@/models/IRoom";
import { IStudent } from "@/models/IStudent";

export default Vue.extend({
  components: {
    Spinner,
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
  data: () => ({
    studentToEdit: null,
    showStudentForm: false
  }),
  methods: {
    handleRemove(studentId: string) {
      this.$store.dispatch(Actions.ADMIN_STUDENT_REMOVE, {
        roomId:  this.room._id,
        studentId
      });
    },
    showEditForm(studentId: any) {
      this.studentToEdit = studentId;
    },
    async handleAdd(student: IStudent) {
     await this.$store.dispatch(Actions.ADMIN_STUDENT_ADD, {
        roomId: this.room._id,
        student
      });
      this.showStudentForm = false
    },
    async handleEdit(student: IStudent) {
     await this.$store.dispatch(Actions.ADMIN_STUDENT_EDIT, {
        roomId: this.room._id,
        studentId: (student as any)._id,
        student
      });
      this.studentToEdit = null
    }
  }
});
</script>