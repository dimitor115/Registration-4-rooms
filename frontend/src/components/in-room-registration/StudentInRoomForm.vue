<template>
  <el-form :inline="true" class="room-form" :rules="formRules" :model="form">
    <el-form-item prop="name">
      <el-input v-model="form.name" placeholder="Imię"></el-input>
    </el-form-item>
    <el-form-item prop="index">
      <el-input v-model="form.index" placeholder="indeks"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="success" @click.prevent="handleAdd">Dodaj</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="danger" icon="el-icon-close" circle @click.prevent="clearForm"></el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { IStudent } from '@/models/IStudent'

export default Vue.extend({
  name: 'home',
  data: () => ({
    form: {
      name: null,
      index: null,
    },
  }),
  computed: {
     userUUID(): string {
      return this.$store.state.user.uuid
    },
    formRules() {
      return {
        name: [
          {required: true, message: 'Imię jest obowiązkowe!', trigger: 'blur'},
          {pattern: /[A-Z]{1}[a-z]+/, message: 'Podaj tylko imię!', trigger: 'change'},
        ],
        index: [
          {required: true, message: 'Indeks jest obowiązkowy!', trigger: 'blur'},
          {pattern: /[1-9]{6}/, message: 'To nie jest poprawny indeks!', trigger: 'change'},
        ],
      }
    },
  },
  methods: {
    handleAdd(): void {
      const student = {
        name: this.form.name,
        index: this.form.index,
        addedBy: this.userUUID,
      }
      this.$emit('onRegister', student)
    },
    clearForm(): void {
      this.form.name = null
      this.form.index = null
    },
  },
})
</script>
<style lang="scss">
.room-form {
  margin: 15px 0;
  margin-left: 90px;
}
</style>
