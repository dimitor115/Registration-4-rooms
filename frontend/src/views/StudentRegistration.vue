<template>
  <div class="wrapper">
    <dynamic-rooms-list></dynamic-rooms-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DynamicRoomsList from '@/components/DynamicRoomsList.vue'

export default Vue.extend({
  name: 'home',
  components: { DynamicRoomsList },
})
</script>
<style scoped>
.wrapper {
  width: 800px;
}
</style>
