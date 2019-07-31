<template>
  <div class="wrapper">
    <el-card>
      <object-form @onSubmit="createNewEntry"></object-form>
    </el-card>
    <object-simple-card />
    <object-simple-card />
    <object-simple-card />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ObjectForm from "../../components/ObjectForm.vue";
import ObjectSimpleCard from "../../components/ObjectSimpleCard.vue";

export default Vue.extend({
  name: "object-managment",
  components: { ObjectForm, ObjectSimpleCard },
  data: () => ({
      objects: []
  }),
  methods: {
    createNewEntry(entry: any) {
        
    }
  }
});
</script>
<style>
.wrapper {
  width: 800px;
}
</style>
