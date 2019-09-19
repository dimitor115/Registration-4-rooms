<template>
  <el-form :inline="true" class="room-form">
    <el-form-item>
      <el-input v-model="student.name" placeholder="Imię"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input v-model="student.index" placeholder="indeks"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click.prevent="handleAdd">Dodaj</el-button>
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
  props: {
    student: {
      type: Object as PropType<IStudent>,
      default: (): IStudent => ({
        name: '',
        index: '',
        addedBy: 'me',
      }),
    },
  },
  methods: {
    handleAdd(): void {
      this.$emit('onRegister', this.student)
      this.student.name = ''
      this.student.index = ''
    },
    clearForm(): void {
      this.student.name = ''
      this.student.index = ''
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
