<template>
  <div id="app" class="app">
    <router-view/>
    <div class="footer">2019 Maciej Kopeć | Native flow</div>
  </div>
</template>
<script>
export default {
  name: 'app',
  created() {
    this.$store.dispatch('countUserFingerPrint')
  }
}
</script>