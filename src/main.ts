import { createApp } from "vue";
import App from "./App.vue";
import Route from "./router";
import "element-plus/dist/index.css";

createApp(App).use(Route).mount("#app");
