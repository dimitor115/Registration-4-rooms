<template>
  <div id="app" class="app">
    <router-view></router-view>
    <div class="footer">2020 Maciej Kopeć | Native flow</div>
  </div>
</template>
<script>
export default {
  name: 'app',
  created() {
    this.$store.dispatch('countUserFingerPrint')
    document.title = this.$route.name || 'Pokoje'
  },
  watch: {
    '$route.name': function (val) {
       document.title = val || 'Pokoje'
    }
  }
}
</script>