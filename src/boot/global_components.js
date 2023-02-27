import AppHeader from '../components/AppHeader.vue'
import AppPageWrapper from '../components/AppPageWrapper.vue'
import AppBottomBar from '../components/AppBottomBar.vue'
import AppInfiniteList from '../components/AppInfiniteList.vue'
import VueApexCharts from 'vue3-apexcharts'

// we globally register our component with Vue
export default ({ app }) => {
  app.component('q-app-header', AppHeader)
  app.component('q-page-wrapper', AppPageWrapper)
  app.component('q-bottom-bar', AppBottomBar)
  app.component('q-infinite-list', AppInfiniteList)
  app.use(VueApexCharts)
}
