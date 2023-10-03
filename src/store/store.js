// Импортируем функцию createStore из библиотеки Vuex
import { createStore } from "vuex";
// Импортируем функцию subscribeToOrderBookStream из файла api
import { subscribeToOrderBookStream } from "@/store/api";

// Экспортируем объект состояния Vuex
export default createStore({
  // Определяем состояние приложения
  state() {
    return {
      isLoading: true, // Флаг загрузки данных
      asks: [], // Массив с предложениями на покупку
      bids: [], // Массив с предложениями на продажу
      ourOrders: [], // Массив с нашими ордерами
      currentCoinPrice: 0 // Текущая цена монеты
    };
  },

  // Определяем геттеры для получения данных из состояния
  getters: {
    hasSpread: (state) => {
      return state.bids.length > 0 && state.asks.length > 0; // Проверяем наличие разницы между предложениями на продажу и покупку
    },
    isLoading(state) {
      return state.isLoading; // Возвращаем флаг загрузки данных
    },
    asks(state) {
      return state.asks; // Возвращаем массив предложений на покупку
    },
    bids(state) {
      return state.bids; // Возвращаем массив предложений на продажу
    },
    ourOrders(state) {
      return state.ourOrders; // Возвращаем массив наших ордеров
    },
    currentCoinPrice(state) {
      return state.currentCoinPrice.toFixed(2); // Возвращаем текущую цену монеты, округленную до двух знаков после запятой
    },
    spread: (state, getters) => {
      if (!getters.hasSpread) {
        return 0; // Если нет разницы между предложениями на покупку и продажу, возвращаем 0
      }
      const bestBid = parseFloat(state.bids[0].price); // Получаем лучшую цену на продажу
      const bestAsk = parseFloat(state.asks[0].price); // Получаем лучшую цену на покупку
      return bestAsk - bestBid; // Возвращаем разницу между лучшей ценой на покупку и продажу
    }
  },

  // Определяем мутации для изменения состояния
  mutations: {
    setLoading: (state, isLoading) => (state.isLoading = isLoading), // Устанавливаем флаг загрузки данных
    setAsks: (state, asks) => (state.asks = asks), // Устанавливаем массив предложений на покупку
    setBids: (state, bids) => (state.bids = bids), // Устанавливаем массив предложений на продажу
    setOurOrders: (state, ourOrders) => (state.ourOrders = ourOrders), // Устанавливаем массив наших ордеров
    setCurrentCoinPrice: (state, currentPrice) =>
      (state.currentCoinPrice = currentPrice) // Устанавливаем текущую цену монеты
  },

  // Определяем действия для выполнения асинхронных операций
  actions: {
    async subscribeToOrderBookStream({ commit }) {
      try {
        const eventSource = await subscribeToOrderBookStream(); // Подписываемся на поток событий для отслеживания изменений в ордербуке
        commit("setLoading", false); // Устанавливаем флаг загрузки данных в false, когда соединение установлено

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data); // Парсим полученные данные в формате JSON
          const asks = data.a.map((ask) => ({
            price: parseFloat(ask[0]), // Парсим цену предложения на покупку в число с плавающей точкой
            quantity: parseFloat(ask[1]) // Парсим количество предложения на покупку в число с плавающей точкой
          }));
          const bids = data.b.map((bid) => ({
            price: parseFloat(bid[0]), // Парсим цену предложения на продажу в число с плавающей точкой
            quantity: parseFloat(bid[1]) // Парсим количество предложения на продажу в число с плавающей точкой
          }));

          commit("setAsks", asks); // Устанавливаем массив предложений на покупку
          commit("setBids", bids); // Устанавливаем массив предложений на продажу

          if (bids && bids.length > 0) {
            const currentPrice = parseFloat(bids[0].price); // Получаем текущую цену монеты из лучшего предложения на продажу
            commit("setCurrentCoinPrice", currentPrice); // Устанавливаем текущую цену монеты
          }
        };
      } catch (error) {
        console.error("Failed to subscribe to order book stream:", error); // Выводим ошибку, если не удалось подписаться на поток событий
        commit("setLoading", false); // Устанавливаем флаг загрузки данных в false в случае ошибки
      }
    }
  }
});
