<template>
  <!-- Отображение компонента информации о спреде -->
  <div class="spread" :class="{ red: spread > 0, green: spread < 0 }">
    Spread: <b>{{ formatSpread() }} %</b>
  </div>
</template>

<script>
  export default {
    props: {
      // Определение свойства spread, которое ожидается в качестве числа и обязательно
      spread: {
        type: Number,
        required: true
      }
    },
    methods: {
      // Метод для форматирования значения spread
      formatSpread() {
        return parseFloat(this.spread).toFixed(2);
      }
    }
  };
</script>

<style>
  /* Стили для компонента информации о спреде */
  .spread {
    font-size: 16px;
  }
</style>
