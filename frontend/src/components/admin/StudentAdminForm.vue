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
          :loading="isEditProcessing"
          circle
          icon="el-icon-edit"
          @click.prevent="handleEdit"
        />
        <el-button
          v-else
          type="success"
          :loading="isCreateProcessing"
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
    isEditProcessing: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    isCreateProcessing: {
      type: Boolean as PropType<boolean>,
      default: false
    },
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
    }
  },
  setup(props, { emit }) {
    //Template refs
    const form = ref<{ validate: () => void } | null>(null)

    const handleAdd = (): void => {
      form.value?.validate()
      if (props.student?.name !== '' && props.student?.surname !== '') {
        emit('onAdd', { ...props.student })
      }
    }
    const handleEdit = (): void => {
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
        ).then(() => {
          emit('onEdit', { ...props.student })
        })
      }
    }

    return {
      formRules,
      handleAdd,
      handleEdit
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
