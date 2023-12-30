export default `<template>
  <div>
    <child-component :user-message="message" />
  </div>
</template>

<script>
  import ChildComponent from "./ChildComponent.vue";

  export default {
    components: {
      ChildComponent
    },
    data() {
      return {
        message: "Привет из родительского компонента!"
      };
    }
  };
</script>
`
