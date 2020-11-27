<template>
  <el-form
    ref="form"
    :inline="true"
    class="room-form admin-form"
    :rules="formRules"
    :model="student"
  >
    <div class="student-input">
      <el-form-item prop="name">
        <el-input v-model="student.name" maxlength="20" placeholder="Imię" />
      </el-form-item>
      <el-form-item prop="surname">
        <el-input v-model="student.surname" maxlength="20" placeholder="Nazwisko" />
      </el-form-item>
    </div>

    <div>
      <el-form-item>
        <el-button
          v-if="editable"
          type="success"
          :loading="isUpdateProcessing"
          circle
          icon="el-icon-edit"
          @click.prevent="handleEdit"
        />
        <el-button
          v-else
          type="success"
          :loading="isRegisterProcessing"
          circle
          icon="el-icon-plus"
          @click.prevent="handleAdd"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="danger" icon="el-icon-close" circle @click.prevent="$emit('onCancel')" />
      </el-form-item>
    </div>
  </el-form>
</template>

<script lang="ts">
import { IStudent } from '@/models/IStudent'
import { MessageBox } from 'element-ui'
import { defineComponent, PropType, ref } from '@vue/composition-api'
import { useRegisterStudentByAdmin, useUpdateStudentByAdmin } from '@/hooks/room'

const formRules = {
  name: [
    {
      required: true,
      message: 'Rodaj imię!',
      trigger: 'blur'
    }
  ],
  surname: [
    {
      required: true,
      message: 'Podaj nazwisko!',
      trigger: 'blur'
    }
  ]
}

export default defineComponent({
  props: {
    editable: {
      type: Boolean as PropType<boolean>,
      default: false
    },
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
    }
  },
  setup(props, { emit }) {
    const { isProcessing: isRegisterProcessing, register } = useRegisterStudentByAdmin()
    const { isProcessing: isUpdateProcessing, update } = useUpdateStudentByAdmin()
    //Template refs
    const form = ref<{ validate: () => void } | null>(null)

    const handleAdd = async () => {
      form.value?.validate()
      if (props.student?.name !== '' && props.student?.surname !== '') {
        await register(props.student, props.roomId)
        emit('afterAdd')
      }
    }
    const handleEdit = async () => {
      form.value?.validate()
      if (props.student?.name !== '' && props.student?.surname !== '') {
        MessageBox.confirm(
          `Jesteś pewnien, że chcesz zmodyfikować uczestnika ${props.student?.name} ${props.student?.surname}?`,
          'Potwierdzenie',
          {
            confirmButtonText: 'Tak',
            cancelButtonText: 'Nie',
            type: 'success'
          }
        ).then(async () => {
          await update(props.student, props.roomId, props.student._id)
          emit('afterEdit')
        })
      }
    }

    return {
      formRules,
      handleAdd,
      handleEdit,
      isUpdateProcessing,
      isRegisterProcessing
    }
  }
})
</script>
<style scoped lang="scss">
.room-form {
  margin: 15px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;

  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
