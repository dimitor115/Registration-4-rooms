<template>
  <el-form :inline="true" class="student-in-room-from" :class="{ 'left-margin': isEmpty }">
    <el-form-item>
      <div class="input-mock" :class="inputMockClass">
        <span>{{ student.name }}</span>
      </div>
    </el-form-item>
    <el-form-item>
      <div class="input-mock" :class="inputMockClass">
        <span>{{ student.surname }}</span>
      </div>
    </el-form-item>

    <el-form-item v-if="isEmpty && showAdd">
      <el-button
        type="success"
        icon="el-icon-plus"
        circle
        @click.prevent="$emit('onAdd', roomId)"
      />
    </el-form-item>
    <el-form-item v-else-if="!isEmpty">
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
        :loading="isRemoveProcessing"
        @click.prevent="confirmAndRemove"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { IStudent } from '@/models/IStudent'
import { computed, defineComponent, PropType } from '@vue/composition-api'
import { removeStudentByAdmin } from '@/actions/room'
import { MessageBox } from 'element-ui'

export default defineComponent({
  props: {
    student: {
      type: Object as PropType<IStudent>,
      default: (): IStudent => ({
        name: '',
        surname: '',
        addedBy: 'me'
      })
    },
    roomId: {
      type: String as PropType<string>,
      required: true
    },
    showAdd: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  setup(props) {
    const { isProcessing: isRemoveProcessing, remove } = removeStudentByAdmin()

    const confirmAndRemove = () => {
      MessageBox.confirm(`Jesteś pewnien, że chcesz usunąć uczestnika?`, 'Potwierdzenie', {
        confirmButtonText: 'Tak',
        cancelButtonText: 'Nie',
        type: 'error'
      }).then(() => remove(props.roomId, props.student._id))
    }

    const isStudentDuplicated = false

    const isEmpty = computed(() => !(props.student.name && props.student.surname))

    const inputMockClass = computed(
      () => (isEmpty ? 'empty-input' : 'fielled-input') + (isStudentDuplicated ? ' duplicate' : '')
    )

    return { inputMockClass, isEmpty, confirmAndRemove, isRemoveProcessing }
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
