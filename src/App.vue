<template>
  <TabBook />
</template>

<script>
  import TabBook from "@/components/TabBook.vue";

  export default {
    name: "App",
    components: {
      TabBook
    }
  };
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /* color: #2c3e50; */
  }

  .el-card {
    --el-card-padding: 8px !important;
  }

  .el-table .el-table__cell {
    padding: 2px 0 !important;
  }

</style>
