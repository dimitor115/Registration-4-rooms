<template>
  <el-form ref="formComponent" :inline="true" class="room-form" :rules="formRules" :model="form">
    <div class="student-input">
      <el-form-item prop="name">
        <el-input v-model="form.name" maxlength="20" placeholder="Imię" />
      </el-form-item>
      <el-form-item prop="surname">
        <el-input v-model="form.surname" maxlength="20" placeholder="Nazwisko" />
      </el-form-item>
    </div>

    <div class="form-buttons">
      <el-form-item>
        <el-button type="success" :loading="isRegisterProcessing" @click.prevent="registerStudent"
          >Dodaj</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="danger" icon="el-icon-close" circle @click.prevent="clearForm" />
      </el-form-item>
    </div>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref } from '@vue/composition-api'
import { registerStudentAction } from '@/actions/room'
import store from '@/store'
const formRules = {
  name: [
    {
      required: true,
      message: 'Podaj imię!',
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

interface StudentForm {
  name: string | null
  surname: string | null
}

export default defineComponent({
  props: {
    roomId: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props) {
    const { isProcessing: isRegisterProcessing, register } = registerStudentAction()

    //Template refs
    const formComponent = ref<{ validate: () => void } | null>(null)
    const form = reactive<StudentForm>({ name: null, surname: null })
    const registerStudent = async () => {
      formComponent.value?.validate()
      if (!!form.name && !!form.surname) {
        const student = {
          name: form.name,
          surname: form.surname,
          addedBy: store.state.user.uuid
        }
        await register(props.roomId, student)
        clearForm()
      }
    }
    const clearForm = () => {
      form.name = null
      form.surname = null
    }

    return {
      isRegisterProcessing,
      registerStudent,
      form,
      formRules,
      clearForm
    }
  }
})
</script>
<style scoped lang="scss">
.room-form {
  margin: 15px 0 15px 88px;
  display: flex;
  flex-direction: row;
  justify-content: center;

  input {
    width: 237px;
  }

  @media only screen and (max-width: 840px) {
    margin-left: 0;
    .student-input {
      padding-right: 50px;
    }
    flex-direction: column;
    .form-buttons > div:first-of-type button {
      width: 485px;
    }
  }

  @media only screen and (max-width: 700px) {
    margin-left: 0;
    .student-input {
      padding-right: 50px;
      margin-bottom: 15px;
      .el-form-item {
        width: 30vw;
      }
    }
    flex-direction: column;
    .form-buttons > div:first-of-type button {
      width: 63vw;
    }
  }
}
</style>
