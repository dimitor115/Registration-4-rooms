<template>
  <el-form :inline="true" class="student-in-room-from" :class="{ 'left-margin': isEmpty }">
    <el-form-item>
      <div class="input-mock" :class="inputMockClass">
        <span>{{ student.name }}</span>
      </div>
    </el-form-item>
    <el-form-item>
      <div class="input-mock" :class="inputMockClass">
        <span>{{ student.index }}</span>
      </div>
    </el-form-item>

    <el-form-item v-if="isEmpty">
      <el-button
        type="success"
        icon="el-icon-plus"
        circle
        @click.prevent="$emit('onAdd', roomId)"
      />
    </el-form-item>
    <el-form-item v-else>
      <el-button
        type="primary"
        icon="el-icon-edit"
        circle
        @click.prevent="$emit('onEdit', student._id)"
      />
      <el-button
        type="danger"
        icon="el-icon-delete"
        circle
        :loading="isRemoveRequestProcessing"
        @click.prevent="$emit('onRemove', student._id)"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { IStudent } from '@/models/IStudent'
import { Actions } from '@/shared/Actions'

export default Vue.extend({
  name: 'StudentFilledForm',
  props: {
    student: {
      type: Object as PropType<IStudent>,
      default: (): IStudent => ({
        name: '',
        index: '',
        addedBy: 'me'
      })
    },
    roomId: {
      type: String as PropType<string>,
      required: true
    }
  },
  computed: {
    isStudentDuplicated(): boolean {
      return this.$store.getters['duplicatedStudents'].find(
        (s: IStudent) => s.index === this.student.index && s.name === this.student.name
      )
    },
    isRemoveRequestProcessing(): boolean {
      return this.$store.state.isProcessing[Actions.ADMIN_STUDENT_REMOVE][
        this.roomId + (this.student as any)._id
      ]
    },
    isEmpty(): boolean {
      return !(this.student.name && this.student.index)
    },
    inputMockClass(): string {
      return (
        (this.isEmpty ? 'empty-input' : 'fielled-input') +
        (this.isStudentDuplicated && ' duplicate')
      )
    }
  }
})
</script>
<style lang="scss">
.input-mock {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  text-align: left;
  span {
    margin-left: 14px;
  }
  &.fielled-input {
    background-color: #f5f7fa;
  }
  &.empty-input {
    background-color: white;
  }
  &.duplicate {
    background-color: #fdf9c2;
  }

  width: 235px;
  @media only screen and (max-width: 700px) {
    width: 100px;
  }
}
.left-margin {
  padding-right: 50px;
}
</style>
