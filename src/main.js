import { createApp } from "vue";
import App from "./App.vue";
import store from "@/store/store.js";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import "element-plus/theme-chalk/dark/css-vars.css";

// Создайте экземпляр приложения Vue и передайте хранилище в качестве опции
const app = createApp(App);
app.use(ElementPlus);
app.use(store);
app.mount("#app");
