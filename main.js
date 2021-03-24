import Vue from 'vue'
import App from './App'
import Bmob from "./utils/Bmob-2.2.5.min.js";
import uView from "uview-ui";
import dayjs from 'dayjs'

Vue.use(uView);
Vue.config.productionTip = false

App.mpType = 'app'
Bmob.initialize("372ebbaa219b7897", "352243");
// 挂载到全局使用
Vue.prototype.$Bmob = Bmob
Vue.prototype.dayjs = dayjs

const app = new Vue({
    ...App
})
app.$mount()
