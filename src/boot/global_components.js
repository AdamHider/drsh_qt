import AppHeader from '../components/AppHeader.vue'

// we globally register our component with Vue
export default ({ app }) => {
  app.component('q-app-header', AppHeader)
}