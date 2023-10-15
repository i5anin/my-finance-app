<template>
  <!-- Объявление шаблона компонента -->
  <div>
    <!-- Контейнер для холста графика -->
    <canvas ref="chart"></canvas>  <!-- Элемент холста с ссылкой 'chart' для последующего доступа в скриптах -->
  </div>
</template>

<script>
// Импорт необходимых классов и адаптера даты из библиотеки Chart.js и chartjs-adapter-date-fns соответственно
import { Chart, LinearScale, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

// Регистрация шкал LinearScale и TimeScale для использования в Chart.js
Chart.register(LinearScale, TimeScale);

// Объявление реактивного свойства для передачи данных графика из родительского компонента
const reactiveProp = {
  props: ['chartData'],  // Определение свойства 'chartData' для передачи данных графика
  data: function () {
    return {
      // Инициализация _chartData данными графика, переданными из родительского компонента или значениями по умолчанию
      _chartData: this.chartData || {
        labels: ['2023-01-01', '2023-01-02', '2023-01-03', '2023-01-04', '2023-01-05'],
        datasets: [{
          label: 'Тестовые данные',
          data: [12, 19, 3, 5, 2],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }
    }
  },
  watch: {
    // Отслеживание изменений в chartData и обновление _chartData и графика при изменении chartData
    chartData: function (newVal) {
      this._chartData = newVal;
      this.$data._chart.update();
    }
  },
}

export default {
  mixins: [reactiveProp],  // Использование миксина reactiveProp в этом компоненте
  mounted() {
    // Создание нового объекта графика при монтировании компонента
    new Chart(this.$refs.chart, {
      type: 'line',  // Тип графика - линейный
      data: this._chartData,  // Данные для отображения на графике
      options: {
        // Опции для настройки осей графика
        scales: {
          x: {
            type: 'time',  // Тип оси X - временной
            time: {
              parser: 'YYYY-MM-DD',  // Формат даты для разбора
              tooltipFormat: 'DD.MM.YYYY',  // Формат даты для отображения во всплывающих подсказках
            },
            title: {
              display: true,  // Отображение заголовка оси X
              text: 'Дата',  // Текст заголовка оси X
            },
          },
          y: {
            type: 'linear',  // Тип оси Y - линейный
            title: {
              display: true,  // Отображение заголовка оси Y
              text: 'Капитализация (RUB)',  // Текст заголовка оси Y
            },
          },
        },
      },
    });
  },
};
</script>
