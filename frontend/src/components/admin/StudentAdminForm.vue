<template>
  <el-form ref="form" :inline="true" class="room-form admin-form" :rules="formRules" :model="student">
    <div class="student-input">
      <el-form-item prop="name">
        <el-input v-model="student.name" maxlength="20" placeholder="Imię" />
      </el-form-item>
      <el-form-item prop="surname">
        <el-input v-model="student.surname" maxlength="6" placeholder="Nazwisko" />
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
          @click.prevent="handleEdit"
        />
        <el-button
          v-else
          type="success"
          :loading="isAddingRequestProcessing"
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
import Vue, { PropType } from 'vue'
import { IStudent } from '@/models/IStudent'
import { Actions } from '@/shared/Actions'

export default Vue.extend({
  props: {
    roomId: {
      type: String as PropType<string>,
      required: true
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
  computed: {
    isEditingRequestProcessing(): boolean {
      return this.$store.state.isProcessing[Actions.ADMIN_STUDENT_EDIT][
        this.roomId + this.student._id
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
    }
  },
  methods: {
    handleAdd(): void {
      ;(this.$refs.form as any)?.validate()
      if (this.student?.name !== '' && this.student?.surname !== '') {
        this.$emit('onAdd', { ...this.student })
      }
    },
    handleEdit(): void {
      ;(this.$refs.form as any)?.validate()
      if (this.student?.name !== '' && this.student?.surname !== '') {

        this.$confirm(
                `Jesteś pewnien, że chcesz zmodyfikować uczestnika ${this.student?.name} ${this.student?.surname}?`,
                'Potwierdzenie',
                {
                  confirmButtonText: 'Tak',
                  cancelButtonText: 'Nie',
                  type: 'success'
                }
        ).then(() => {
          this.$emit('onEdit', { ...this.student })
        })
      }
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
