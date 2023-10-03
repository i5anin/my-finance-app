<template>
  <!-- Создание таблицы с заказами -->
  <el-table class="order-table" :data="visibleOrders" border>
    <!-- Колонка таблицы -->
    <el-table-column>
      <!-- Использование слота для определения содержимого ячейки -->
      <template v-slot="{ row }">
        <!-- Добавление классов к div в зависимости от условий -->
        <div
          :class="{
            highlighted: isOurOrder(row),
            'sell-cell': type === 'sell',
            'buy-cell': type === 'buy'
          }"
        >
          <!-- Вывод содержимого в зависимости от условий -->
          <span v-if="type === 'buy' && row === visibleOrders[centerIndex]">
          </span>
          <span v-if="currency === 'btc'">
            <b>{{ formatPrice(row.price) }}</b>
          </span>
        </div>
      </template>
      <!-- Шаблон для заголовка колонки -->
      <template v-slot:header>
        <span
          ><b>{{ headerText }}</b></span
        >
      </template>
    </el-table-column>
    <!-- Колонка таблицы -->
    <el-table-column prop="quantity">
      <template v-slot="{ row }">
        <!-- Вывод содержимого в зависимости от условий -->
        <span v-if="row.quantity !== 0">{{
          formatQuantity(row.quantity)
        }}</span>
      </template>
      <!-- Шаблон для заголовка колонки -->
      <template v-slot:header>
        <span v-if="currency === 'btc'">{{ headerText }}</span>
      </template>
    </el-table-column>
    <!-- Колонка таблицы -->
    <el-table-column>
      <template v-slot="{ row }">
        <!-- Вывод содержимого в зависимости от условий -->
        <span v-if="row.price !== 0 && row.quantity !== 0">{{
          formatTotal(row.price, row.quantity)
        }}</span>
      </template>
      <!-- Шаблон для заголовка колонки -->
      <template v-slot:header>Всего</template>
    </el-table-column>
  </el-table>
</template>

<script>
  // Импорт функции mapGetters из библиотеки Vuex
  import { mapGetters } from "vuex";

  export default {
    // Определение входных параметров компонента
    props: {
      orders: {
        type: Array,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      ourOrders: {
        type: Array,
        default: () => []
      },
      currency: {
        type: String,
        required: true
      },
      headerText: {
        type: [String, Number],
        required: true
      }
    },
    // Определение вычисляемых свойств компонента
    computed: {
      ...mapGetters(["currentCoinPrice"]),
      visibleOrders() {
        return this.calculateVisibleOrders();
      }
    },
    // Определение данных компонента
    data() {
      return {
        centerIndex: null
      };
    },
    // Определение методов компонента
    methods: {
      calculateVisibleOrders() {
        const filteredOrders = this.orders.filter(
          (order) => order.quantity !== 0 && order.total !== 0
        );
        const centerIndex = Math.floor(filteredOrders.length / 2);
        const start = centerIndex - 10;
        const end = centerIndex + 11; // Включите центральный ряд + 10 рядов с каждой стороны

        let visibleOrders;
        if (this.type === "sell") {
          visibleOrders = filteredOrders.slice().reverse().slice(start, end);
        } else {
          visibleOrders = filteredOrders.slice(start, end);
        }

        this.centerIndex = centerIndex;

        return visibleOrders;
      },
      isOurOrder(order) {
        return this.ourOrders.some(
          (ourOrder) => ourOrder.price === order.price
        );
      },
      formatPrice(price) {
        return parseFloat(price).toFixed(2);
      },
      formatQuantity(quantity) {
        return parseFloat(quantity).toFixed(6);
      },
      formatTotal(price, quantity) {
        const total = price * quantity;
        return parseFloat(total).toFixed(2);
      }
    }
  };
</script>

<style scoped>
  /* Стили для таблицы */
  .order-table {
    min-height: 46vh;
    max-height: 46vh;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: flex-end;
  }
</style>
