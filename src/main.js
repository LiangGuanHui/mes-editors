import Vue from 'vue'
import ElementUI from 'element-ui'
import App from '@/App'
import router from '@/router'
import DialogForm from '@/components/DialogForm'
import ExSelect from '@/components/ExSelect'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(DialogForm)
Vue.use(ExSelect)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
