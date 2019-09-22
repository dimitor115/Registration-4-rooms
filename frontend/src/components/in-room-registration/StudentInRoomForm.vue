<template>
  <el-form :inline="true" class="room-form">
    <el-form-item>
      <el-input v-model="name" placeholder="Imię"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input v-model="index" placeholder="indeks"></el-input>
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
  data: () => ({
    name: null,
    index: null,
  }),
  computed: {
     userUUID(): string {
      return this.$store.state.user.uuid
    },
  },
  methods: {
    handleAdd(): void {
      const student = {
        name: this.name,
        index: this.index,
        addedBy: this.userUUID,
      }
      this.$emit('onRegister', student)
    },
    clearForm(): void {
      this.name = null
      this.index = null
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
