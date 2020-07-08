<template>
  <el-form :inline="true" :model="entry" class="object-form">
    <el-form-item>
      <el-input v-model="entry.name" placeholder="Nazwa" />
    </el-form-item>
    <el-form-item>
      <el-input-number v-model="entry.size" :min="1" />
    </el-form-item>
    <el-form-item>
      <el-button
        :type="edit ? 'success' : 'primary'"
        :loading="isProcessing"
        @click="handleSubmit"
        >
        {{ edit ? 'Zapisz' : 'Dodaj' }}
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button v-if="edit" type="danger" @click="$emit('onCancel')">Anuluj</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import store from '@/store'
import { computed, defineComponent, PropType } from '@vue/composition-api'
import { SingleActions, Actions } from '@/shared/Actions'
import { IRoomForm } from '@/models/IRoom'

export default defineComponent({
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    entry: {
      type: Object as PropType<IRoomForm>,
      default: (): IRoomForm => ({
        name: '',
        size: 0,
        _id: '' //FIXME !
      })
    }
  },
  setup(props, ctx) {
    const isProcessing = computed(() =>
      props.edit
        ? store.state.isProcessing[Actions.UPDATE_ROOM][props.entry._id]
        : store.state.isProcessing[SingleActions.CREATE_ROOM]
    )

    const handleSubmit = () => {
      const { name, size } = props.entry
      ctx.emit('onSubmit', { name, size })
      props.entry.name = ''
      props.entry.size = 0
    }
    return { isProcessing, handleSubmit }
  }
})
</script>
<style lang="scss">
.object-form > div {
  margin-bottom: 0;
}
</style>
