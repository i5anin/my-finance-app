<template>
  <!-- Создание контейнера для отображения книги ордеров -->
  <div class="order-book dark">
    <!-- Отображение информации о спреде -->
    <el-card v-if="hasSpread" class="spread-info">
      <b>{{ currentCoinPrice }}</b
      ><SpreadInfo :spread="spread" />
    </el-card>
    <!-- Отображение спиннера загрузки -->
    <loading-spinner :loading="isLoading">
      <!-- Заголовочная строка -->
      <div class="header-row">
        <div class="current-price"></div>
      </div>
      <!-- Отображение таблицы ордеров на продажу -->
      <OrderTable
        :orders="asks"
        type="sell"
        :ourOrders="ourOrders"
        :currency="selectedCurrency"
        :headerText="'Цена (BTC)'"
      />
      <!-- Отображение таблицы ордеров на покупку -->
      <OrderTable
        :orders="bids"
        type="buy"
        :ourOrders="ourOrders"
        :currency="selectedCurrency"
        :headerText="currentCoinPrice"
      />
      <!-- :headerText="[currentCoinPrice, spread]" -->
    </loading-spinner>
  </div>
</template>

<script>
  // Импорт компонентов
  import OrderTable from "@/components/OrderTable.vue";
  import SpreadInfo from "@/components/SpreadInfo.vue";
  import LoadingSpinner from "@/components/LoadingSpinner.vue";
  import { mapGetters } from "vuex";

  export default {
    components: {
      OrderTable,
      SpreadInfo,
      LoadingSpinner
    },
    // Определение данных компонента
    data() {
      return {
        selectedCurrency: "btc"
      };
    },
    // Определение вычисляемых свойств компонента
    computed: mapGetters([
      "isLoading",
      "hasSpread",
      "spread",
      "asks",
      "bids",
      "ourOrders",
      "currentCoinPrice"
    ]),

    created() {
      // Подписка на поток данных о книге ордеров
      this.$store.dispatch("subscribeToOrderBookStream");
    },
    methods: {
      refreshOrders() {
        // Обновление ордеров
        this.$store.dispatch("fetchOurOrders");
      }
    }
  };
</script>
