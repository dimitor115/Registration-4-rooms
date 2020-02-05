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
    timer: null,
    isEnd: false
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
      this.isEnd = true
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

      this.startSeconds = 25
      this.secondsUntil = seconds

      this.timer = new Timer()
      this.timer.setup(seconds)
      this.timer.start(this.updateSeconds, this.onTimeEnd)
    }
  }
}
</script>
