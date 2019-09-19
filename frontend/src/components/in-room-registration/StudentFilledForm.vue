<template>
  <el-form :inline="true" class="student-in-room-from mock-form" :class="{'left-margin': isEmpty}">
    <el-form-item>
      <div class="input-mock" :class="inputMockClass">
        <span>{{student.name}}</span>
      </div>
    </el-form-item>
    <el-form-item>
      <div class="input-mock" :class="inputMockClass">
        <span>{{student.index}}</span>
      </div>
    </el-form-item>
    <el-form-item v-if="!isEmpty">
      <el-button type="danger" icon="el-icon-delete" circle @click.prevent="handleRemove"></el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { IStudent } from "@/models/IStudent";

export default Vue.extend({
  name: "StudentFilledForm",
  props: {
    student: {
      type: Object as PropType<IStudent>,
      default: (): IStudent => ({
        name: "",
        index: "",
        addedBy: "me"
      })
    }
  },
  computed: {
    isEmpty(): boolean {
      return !(this.student.name && this.student.index);
    },
    inputMockClass(): string {
      return this.isEmpty ? "empty-input" : "fielled-input"
    }
  },
  methods: {
    handleRemove(): void {
      this.$emit("onRemove", this.student);
    }
  }
});
</script>
<style lang="scss">
.input-mock {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  width: 235px;
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
}
.left-margin {
  padding-right: 50px;
}
</style>
