<template>
  <el-form
    :inline="true"
    class="student-in-room-from mock-form"
    :class="{ 'left-margin': isEmpty || !canEntryBeRemove || !allowRemoving }"
  >
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
    <el-form-item v-if="!isEmpty && canEntryBeRemove && allowRemoving">
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
import store from '@/store'
import { computed, defineComponent, PropType } from '@vue/composition-api'
import { useRemoveStudent } from '@/hooks/room'
import { MessageBox } from 'element-ui'
export default defineComponent({
  name: 'StudentFilledForm',
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
    allowRemoving: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const { isProcessing: isRemoveProcessing, remove } = useRemoveStudent()

    const canEntryBeRemove = computed(() => props.student.addedBy === store.state.user.uuid)
    const isEmpty = computed(() => !(props.student.name && props.student.surname))
    const inputMockClass = computed(() => (isEmpty ? 'empty-input' : 'fielled-input'))

    const confirmAndRemove = () => {
      MessageBox.confirm(
        `Jesteś pewnien, że chcesz usunąć uczestnika ${props.student.name} ${props.student.surname}?`,
        'Potwierdzenie',
        {
          confirmButtonText: 'Tak',
          cancelButtonText: 'Nie',
          type: 'error'
        }
      ).then(() => remove(props.roomId, props.student, store.state.user.uuid))
    }

    return {
      isRemoveProcessing,
      confirmAndRemove,
      canEntryBeRemove,
      isEmpty,
      inputMockClass
    }
  }
})
</script>
<style lang="scss">
.student-in-room-from {
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

    width: 235px;
    @media only screen and (max-width: 700px) {
      width: 30vw;
    }
  }
}
.left-margin {
  padding-right: 50px;
}
</style>
