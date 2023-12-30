export default `<template>
  <div>
    Сообщение от родителя: {{ userMessage }}
  </div>
</template>

<script>
export default {
  props: {
    userMessage: {
      type: String,
      required: true
    }
  }
};
</script>
`
