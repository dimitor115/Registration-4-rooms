<template>
  <div>
    <el-progress
      text-inside
      :stroke-width="20"
      :percentage="untilPercentage"
      :format="progressFormat"
      :status="isCurrentUser ? 'success' : null"
    />
  </div>
</template>
<script>
import moment from 'moment'
import Timer from '@/shared/timer'
export default {
  name: 'ReservationCountDown',
  props: {
    until: {
      type: String,
      required: true
    },
    isCurrentUser: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    startSeconds: null,
    secondsUntil: null,
    timer: null
  }),
  computed: {
    untilPercentage() {
      return (this.secondsUntil / this.startSeconds) * 100 || 0
    }
  },
  watch: {
    until: function() {
      this.setupCountDown()
    }
  },
  mounted() {
    this.setupCountDown()
  },
  methods: {
    updateSeconds(secondsUntil) {
      this.secondsUntil = secondsUntil
    },
    onTimeEnd() {
      console.log('time end')
    },
    progressFormat() {
      return this.secondsUntil + ' s'
    },
    setupCountDown() {
      if (this.timer) this.timer.stop()

      const dateUntil = moment(this.until)
      const dateDiff = dateUntil.diff(moment())
      const seconds = moment
        .duration(dateDiff)
        .asSeconds()
        .toFixed()

      this.startSeconds = 22
      this.secondsUntil = seconds

      this.timer = new Timer()
      this.timer.setup(seconds)
      this.timer.start(this.updateSeconds, this.onTimeEnd)
    }
  }
}
</script>
