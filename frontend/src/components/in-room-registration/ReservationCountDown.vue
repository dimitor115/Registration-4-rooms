<template>
  <div>
    <el-progress text-inside :stroke-width="20" :percentage="untilPercentage" :format="progressFormat"></el-progress>
  </div>
</template>
<script>
import moment from "moment";
import Timer from "@/shared/timer";
export default {
  name: "ReservationCountDown",
  props: {
    until: {
      type: String,
      required: true
    }
  },
  data: () => ({
    startSeconds: null,
    secondsUntil: null
  }),
  mounted() {
    const dateUntil = moment(this.until);
    const dateDiff = dateUntil.diff(moment());
    const seconds = moment
      .duration(dateDiff)
      .asSeconds()
      .toFixed();

    this.startSeconds = seconds;
    this.secondsUntil = seconds;

    const timer = new Timer();
    timer.setup(seconds);
    timer.start(this.updateSeconds, this.onTimeEnd);
  },
  computed: {
    untilPercentage() {
      return (this.secondsUntil / this.startSeconds) * 100 || 0
    }
  },
  methods: {
    updateSeconds(secondsUntil) {
      this.secondsUntil = secondsUntil;
    },
    onTimeEnd() {
      console.log("time end");
    },
    progressFormat() {
      return this.secondsUntil + " s";
    }
  }
};
</script>