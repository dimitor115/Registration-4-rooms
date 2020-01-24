<template>
  <el-form
    :inline="true"
    class="student-in-room-from mock-form"
    :class="{ 'left-margin': isEmpty || !canEntryByRemove || !allowRemoving }"
  >
    <el-form-item>
      <div class="input-mock" :class="inputMockClass">
        <span>{{ student.name }}</span>
      </div>
    </el-form-item>
    <el-form-item>
      <div class="input-mock" :class="inputMockClass">
        <span>{{ student.index }}</span>
      </div>
    </el-form-item>
    <el-form-item v-if="!isEmpty && canEntryByRemove && allowRemoving">
      <el-button
        type="danger"
        icon="el-icon-delete"
        circle
        :loading="isRemoveRequestProcessing"
        @click.prevent="handleRemove"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { IStudent } from '@/models/IStudent'
import { Actions } from '@/shared/Actions'

export default Vue.extend({
  name: 'StudentFilledForm',
  props: {
    student: {
      type: Object as PropType<IStudent>,
      default: (): IStudent => ({
        name: '',
        index: '',
        addedBy: 'me'
      })
    },
    roomId: {
      type: String as PropType<string>,
      required: true
    },
    allowRemoving: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isRemoveRequestProcessing(): boolean {
      return this.$store.state.isProcessing[Actions.REMOVE_STUDENT][this.roomId + this.student]
    },
    canEntryByRemove(): boolean {
      return this.student.addedBy === this.userUUID
    },
    userUUID(): string {
      return this.$store.state.user.uuid
    },
    isEmpty(): boolean {
      return !(this.student.name && this.student.index)
    },
    inputMockClass(): string {
      return this.isEmpty ? 'empty-input' : 'fielled-input'
    }
  },
  methods: {
    handleRemove(): void {
      this.$emit('onRemove', this.student, this.userUUID)
    }
  }
})
</script>
<style lang="scss">
.input-mock {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
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

  width: 235px;
  @media only screen and (max-width: 700px) {
    width: 100px;
  }
}
.left-margin {
  padding-right: 50px;
}
</style>
