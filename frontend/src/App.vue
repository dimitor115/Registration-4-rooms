<template>
  <div id="app" class="app">
    <router-view />
    <div class="footer">2020 Maciej Kopeć | Native flow</div>
  </div>
</template>
<script>
export default {
  name: 'App',
  watch: {
    '$route.name': function(val) {
      document.title = val || 'Pokoje'
    }
  },
  created() {
    this.$store.dispatch('countUserFingerPrint')
    document.title = this.$route.name || 'Pokoje'
  }
}
</script>
