<template>
  <el-dialog :title="title" :visible.sync="isDialogVisible" width="30%" center>
    <span>{{ content }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="centerDialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="centerDialogVisible = false">Confirm</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isDialogVisible: false
    }
  },
  methods: {
    open() {
      this.isDialogVisible = true
    },
    close() {
      this.isDialogVisible = false
    }
  }
}
</script>
