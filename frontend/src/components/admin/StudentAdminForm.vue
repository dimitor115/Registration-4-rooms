<template>
  <el-form :inline="true" class="room-form" :rules="formRules" :model="student">
    <div class="student-input">
      <el-form-item prop="name">
        <el-input v-model="student.name" placeholder="Imię" />
      </el-form-item>
      <el-form-item prop="index">
        <el-input v-model="student.index" placeholder="Indeks" />
      </el-form-item>
    </div>

    <div>
      <el-form-item>
        <el-button
          v-if="editable"
          type="success"
          :loading="isEditingRequestProcessing"
          circle
          icon="el-icon-edit"
          @click.prevent="$emit('onEdit', { ...student })"
        />
        <el-button
          v-else
          type="success"
          :loading="isAddingRequestProcessing"
          circle
          icon="el-icon-plus"
          @click.prevent="$emit('onAdd', { ...student })"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="danger" icon="el-icon-close" circle @click.prevent="$emit('onCancel')" />
      </el-form-item>
    </div>
  </el-form>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { IStudent } from '@/models/IStudent'
import { Actions } from '@/shared/Actions'

export default Vue.extend({
  name: 'Home',
  props: {
    roomId: {
      type: String as PropType<string>,
      required: true
    },
    editable: {
      type: Boolean as PropType<boolean>,
      required: true
    },
    student: {
      type: Object as PropType<IStudent>,
      default: (): IStudent => ({
        name: '',
        index: '',
        addedBy: 'me'
      })
    }
  },
  computed: {
    isEditingRequestProcessing(): boolean {
      return this.$store.state.isProcessing[Actions.ADMIN_STUDENT_EDIT][
        this.roomId + (this.student as any)._id
      ]
    },
    isAddingRequestProcessing(): boolean {
      return this.$store.state.isProcessing[Actions.ADMIN_STUDENT_ADD][this.roomId + this.student]
    },
    formRules() {
      return {
        name: [
          {
            required: true,
            message: 'Imię jest obowiązkowe!',
            trigger: 'blur'
          },
          {
            pattern: /[A-Z]{1}[a-z]+/,
            message: 'Podaj tylko imię!',
            trigger: 'change'
          }
        ],
        index: [
          {
            required: true,
            message: 'Indeks jest obowiązkowy!',
            trigger: 'blur'
          },
          {
            pattern: /[0-9]{6}/,
            message: 'To nie jest poprawny indeks!',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    handleAdd(): void {
      this.$emit('onAdd', { ...this.student })
    }
  }
})
</script>
<style lang="scss">
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
