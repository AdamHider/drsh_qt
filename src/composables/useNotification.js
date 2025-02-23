import { reactive } from 'vue'
import { api } from '../services/index'
const notifications = reactive({
  list: []
})

export function useNotification () {
  function initSSE () {
    var url = api.baseUrl+'SSE';
    if(localStorage['x-sid']) url += '/'+localStorage['x-sid'];

    //url = api.baseUrl+'ssetest.php';
    const evtSource = new EventSource(url, { withCredentials: true });
    evtSource.addEventListener('ping', (event) => {
      const result = JSON.parse(event.data)
      for(var i in result){
        result[i].data = JSON.parse(result[i].data)
      }
      notifications.list = result;
    }, false);
  }

  return {
    initSSE,
    notifications
  }
}
