import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import IntegersOnlyDirective from '@/directives/integers-only.ts'

createApp(App).directive('integers-only', IntegersOnlyDirective).mount('#app')
