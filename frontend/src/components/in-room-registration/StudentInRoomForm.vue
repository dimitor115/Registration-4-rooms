<template>
  <el-form ref="form" :inline="true" class="room-form" :rules="formRules" :model="form">
    <div class="student-input">
      <el-form-item prop="name">
        <el-input v-model="form.name" maxlength="20" placeholder="Imię" />
      </el-form-item>
      <el-form-item prop="surname">
        <el-input v-model="form.surname" maxlength="6" placeholder="Nazwisko" />
      </el-form-item>
    </div>

    <div class="form-buttons">
      <el-form-item>
        <el-button
          type="success"
          :loading="isRegistrationRequestProcessing"
          @click.prevent="handleAdd"
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
import Vue, { PropType } from 'vue'
import { Actions } from '@/shared/Actions'

export default Vue.extend({
  props: {
    roomId: {
      type: String as PropType<string>,
      required: true
    }
  },
  data: () => ({
    form: {
      name: null,
      surname: null
    }
  }),
  computed: {
    isRegistrationRequestProcessing(): boolean {
      return this.$store.state.isProcessing[Actions.REGISTER_STUDENT][this.roomId] || false
    },
    userUUID(): string {
      return this.$store.state.user.uuid
    },
    formRules() {
      return {
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
    }
  },
  methods: {
    handleAdd(): void {
      ;(this.$refs.form as any)?.validate()
      if (this.form.name && this.form.surname) {
        const student = {
          name: this.form.name,
          surname: this.form.surname,
          addedBy: this.userUUID
        }
        this.$emit('onRegister', student)
        this.clearForm()
      }
    },
    clearForm(): void {
      this.form.name = null
      this.form.surname = null
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
