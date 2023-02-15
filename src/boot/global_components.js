import AppHeader from '../components/AppHeader.vue'
import VueApexCharts from 'vue3-apexcharts'

// we globally register our component with Vue
export default ({ app }) => {
  app.component('q-app-header', AppHeader)
  app.use(VueApexCharts)
}
