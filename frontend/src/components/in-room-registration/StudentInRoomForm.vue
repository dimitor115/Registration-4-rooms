<template>
  <el-form :inline="true" class="room-form" :rules="formRules" :model="form">
    <div class="student-input">
      <el-form-item prop="name">
        <el-input v-model="form.name" placeholder="Imię"></el-input>
      </el-form-item>
      <el-form-item prop="index">
        <el-input v-model="form.index" placeholder="Indeks"></el-input>
      </el-form-item>
    </div>

    <div class="form-buttons">
      <el-form-item>
        <el-button type="success" @click.prevent="handleAdd" :loading="isRegistrationRequestProcessing">Dodaj</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" icon="el-icon-close" circle @click.prevent="clearForm"></el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { IStudent } from "@/models/IStudent";
import { Actions } from '@/shared/Actions';

export default Vue.extend({
  name: "home",
  data: () => ({
    form: {
      name: null,
      index: null
    }
  }),
  computed: {
    isRegistrationRequestProcessing(): boolean {
      return this.$store.state.isProcessing[Actions.REGISTER_STUDENT]
    },
    userUUID(): string {
      return this.$store.state.user.uuid;
    },
    formRules() {
      return {
        name: [
          {
            required: true,
            message: "Imię jest obowiązkowe!",
            trigger: "blur"
          },
          {
            pattern: /[A-Z]{1}[a-z]+/,
            message: "Podaj tylko imię!",
            trigger: "change"
          }
        ],
        index: [
          {
            required: true,
            message: "Indeks jest obowiązkowy!",
            trigger: "blur"
          },
          {
            pattern: /[0-9]{6}/,
            message: "To nie jest poprawny indeks!",
            trigger: "change"
          }
        ]
      };
    }
  },
  methods: {
    handleAdd(): void {
      const student = {
        name: this.form.name,
        index: this.form.index,
        addedBy: this.userUUID
      };
      this.$emit("onRegister", student);
      this.clearForm();
    },
    clearForm(): void {
      this.form.name = null;
      this.form.index = null;
    }
  }
});
</script>
<style lang="scss">
.room-form {
  margin: 15px 0;
  margin-left: 85px;
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
    input {
      width: 100px;
    }

    margin-left: 0;
    .student-input {
      padding-right: 50px;
      margin-bottom: 15px;
    }
    flex-direction: column;
    .form-buttons > div:first-of-type button {
      width: 215px;
    }
  }
}
</style>
