<template>
  <el-form :inline="true" class="object-form">
    <el-form-item>
      <el-input v-model="student.name" placeholder="Imię"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input v-model="student.index" placeholder="Indeks"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click.prevent="handleAdd">Dodaj</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="danger" icon="el-icon-delete" circle @click.prevent="handleRemove"></el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { IStudent } from "@/models/IStudent";

export default Vue.extend({
  name: "home",
  props: {
    student: {
      type: Object as PropType<IStudent>,
      default: (): IStudent => ({
        name: "",
        index: "",
        addedBy: ""
      })
    }
  },
  methods: {
    handleAdd(): void {
      this.$emit("onRegister", this.student);
    },
    handleRemove(): void {
      this.$emit("onRemove", this.student);
    }
  }
});
</script>
