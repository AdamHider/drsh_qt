import AppHeader from '../components/AppHeader.vue'
import AppPageWrapper from '../components/AppPageWrapper.vue'
import AppBottomBar from '../components/AppBottomBar.vue'
import AppInfiniteList from '../components/AppInfiniteList.vue'
import AppSpendButton from '../components/AppSpendButton.vue'
import AppProgressBar from '../components/AppProgressBar.vue'
import AppTutorialItem from '../components/AppTutorialItem.vue'

//Desktop
import AppBottomBarDesktop from '../components/AppBottomBarDesktop.vue'


// we globally register our component with Vue
export default ({ app }) => {
  app.component('q-app-header', AppHeader)
  app.component('q-page-wrapper', AppPageWrapper)
  app.component('q-bottom-bar', AppBottomBar)
  app.component('q-infinite-list', AppInfiniteList)
  app.component('q-spend-button', AppSpendButton)
  app.component('q-progress-bar', AppProgressBar)
  app.component('q-tutorial-item', AppTutorialItem)
  app.component('q-bottom-bar-desktop', AppBottomBarDesktop)
}
