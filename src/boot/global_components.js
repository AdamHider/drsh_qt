import QSegment from '../components/QSegment'

// we globally register our component with Vue
export default ({ app }) => {
  app.component('q-segment', QSegment)
}