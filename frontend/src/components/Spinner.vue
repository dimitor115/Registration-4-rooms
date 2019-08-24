<template>
  <section>
    <div v-show="isProcessing" class="spinner-container">
      <i class="spinner" :style="spinnerStyle"></i>
    </div>
    <slot v-show="!isProcessing"></slot>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Actions } from '@/shared/Actions'

export default Vue.extend({
  name: 'spinner',
  props: {
    action: {
      type: String as PropType<Actions>,
      default: undefined,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 1.7,
    },
  },
  computed: {
    isProcessing(): boolean {
      return this.$store.state.isProcessing[Actions.FEACH_ALL_ROOMS]
    },
    spinnerStyle(): any {
      return {
        'width': `${this.size}em`,
        'height': `${this.size}em`,
        'border-width': `${(this.size as number) / 4}em`,
      }
    },
  },
})
</script>
<style lang="scss">
.spinner-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 500px;
}

.spinner {
  animation: spinner 0.7s linear infinite;
  border-style: solid;
  border-color: gainsboro;
  border-top-color: #409eff;
  border-radius: 100%;
  display: block;
}
@keyframes spinner {
  to {
    transform: rotate(1turn);
  }
}
</style>