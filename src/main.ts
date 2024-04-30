import '@/assets/style/base.less';
import '@/utils/request';
import globalComponents from '@/components';
import 'virtual:svg-icons-register';
import { Button } from 'vue-amazing-ui'
import 'vue-amazing-ui/css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(globalComponents)
// app.use(Button)

app.mount('#app')
