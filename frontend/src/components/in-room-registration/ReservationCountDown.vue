<template>
  <div>
    <small v-if="isCurrentUser">
      Czas pozostały do końca Twojej rezerwacji tego stolika. W tym momencie tylko Ty możesz tu
      wpisywać uczestników!
    </small>
    <el-progress
      v-if="!isEnd"
      text-inside
      :stroke-width="20"
      :percentage="untilPercentage"
      :format="progressFormat"
      :status="isCurrentUser ? 'success' : null"
    />
  </div>
</template>
<script lang="ts">
import moment from 'moment'
import Timer from '@/shared/timer'
import { computed, defineComponent, onMounted, PropType, ref, watch } from '@vue/composition-api'

export default defineComponent({
  name: 'ReservationCountDown',
  props: {
    until: {
      type: String as PropType<string>,
      required: true
    },
    isCurrentUser: {
      type: Boolean as PropType<boolean>,
      required: true
    }
  },
  setup(props) {
    const startSeconds = ref<number | null>(null)
    const secondsUntil = ref<number | null>(null)
    const timer = new Timer()
    const isEnd = ref(false)

    const untilPercentage = computed(() =>
      secondsUntil.value && startSeconds.value ? (secondsUntil.value / startSeconds.value) * 100 : 0
    )

    const setupCountDown = () => {
      timer.stop()

      const dateUntil = moment(props.until)
      const dateDiff = dateUntil.diff(moment())
      const seconds = parseInt(
        moment
          .duration(dateDiff)
          .asSeconds()
          .toFixed()
      )

      startSeconds.value = 25
      secondsUntil.value = seconds

      timer.setup(seconds)
      timer.start(
        sec => (secondsUntil.value = sec),
        () => (isEnd.value = true)
      )
    }

    watch(() => props.until, setupCountDown)
    onMounted(setupCountDown)

    const progressFormat = () => secondsUntil.value + ' s'

    return {
      isEnd,
      untilPercentage,
      progressFormat
    }
  }
})
</script>
