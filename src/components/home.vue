<template>
  <div>
    <el-button type="info" @click="exit">退出</el-button>
  </div>
</template>

<script>
  export default {
    name: 'home',
    methods: {
      exit() {
        window.sessionStorage.removeItem('token')
        this.$router.push('/login')
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
