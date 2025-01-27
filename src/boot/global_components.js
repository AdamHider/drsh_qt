import AppHeader from '../components/AppHeader.vue'
import AppPageWrapper from '../components/AppPageWrapper.vue'
import AppBottomBar from '../components/AppBottomBar.vue'
import AppInfiniteList from '../components/AppInfiniteList.vue'
import AppSpendButton from '../components/AppSpendButton.vue'
import PinField from '../components/PinField.vue'
import AppProgressBar from '../components/AppProgressBar.vue'
import VueApexCharts from 'vue3-apexcharts'

// we globally register our component with Vue
export default ({ app }) => {
  app.component('q-app-header', AppHeader)
  app.component('q-page-wrapper', AppPageWrapper)
  app.component('q-bottom-bar', AppBottomBar)
  app.component('q-infinite-list', AppInfiniteList)
  app.component('q-spend-button', AppSpendButton)
  app.component('q-pin-field', PinField)
  app.component('q-progress-bar', AppProgressBar)
  app.use(VueApexCharts)
}
