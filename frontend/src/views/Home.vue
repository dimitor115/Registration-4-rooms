<template>
<div>
  <h1>Apka pokoje </h1>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import io from "socket.io-client";
import { IRoom } from '@/models/IRoom';
const socket = io("http://localhost:3000")

export default Vue.extend({
  name: 'home',
  mounted() {
     socket.emit("test")
     socket.on("rooms", (rooms: IRoom[]) => {
       console.log(rooms)
     });
  }
})
</script>
