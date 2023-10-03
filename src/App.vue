<template>
  <OrderBook />
</template>

<script>
  import OrderBook from "@/components/OrderBook.vue";

  export default {
    name: "App",
    components: {
      OrderBook
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

  .red,
  .sell-cell {
    color: red;
  }

  .green,
  .buy-cell {
    color: green;
  }

  .yellow,
  .highlighted {
    color: yellow;
  }
</style>
