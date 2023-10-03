<template>
  <div>
    <div
      v-loading="loading"
      element-loading-text="Loading..."
      :element-loading-spinner="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
      :class="{ 'loading-container': loading }"
    >
      <div v-if="!loading">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        svg: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
      };
    },
    props: {
      loading: {
        type: Boolean,
        required: true
      }
    }
  };
</script>

<style>
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
</style>
