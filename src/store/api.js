export function subscribeToOrderBookStream() {
  // Определение базового URL и URL-адреса запроса для подписки на поток данных
  const baseUrl = "wss://stream.binance.com:9443";
  const requestUrl = `${baseUrl}/ws/btcusdt@depth@1000ms`;

  // Создание нового WebSocket-соединения с указанным URL-адресом запроса
  const eventSource = new WebSocket(requestUrl);

  // Возвращение обещания для асинхронной операции подписки на поток данных
  return new Promise((resolve, reject) => {
    // Обработчик события открытия соединения WebSocket
    eventSource.onopen = () => {
      resolve(eventSource); // Разрешение обещания и передача объекта WebSocket
    };

    // Обработчик события получения сообщения от сервера WebSocket
    eventSource.onmessage = (event) => {
      // Обработка полученных данных
      const data = JSON.parse(event.data);
      const asks = data.a.map((ask) => ({
        price: parseFloat(ask[0]),
        quantity: parseFloat(ask[1])
      }));
      const bids = data.b.map((bid) => ({
        price: parseFloat(bid[0]),
        quantity: parseFloat(bid[1])
      }));

      // Создание пользовательского события для уведомления хранилища о новых данных
      const customEvent = new CustomEvent("orderBookUpdate", {
        detail: {
          asks,
          bids
        }
      });
      document.dispatchEvent(customEvent); // Распространение события в документе
    };

    // Обработчик события ошибки WebSocket
    eventSource.onerror = (error) => {
      reject(error); // Отклонение обещания в случае ошибки
    };
  });
}
