import { reactive } from 'vue'
import { api } from '../services/index'
const achievement = reactive({
  list: [],
  limit: 8,
  offset: 0
})

export function useUpdate () {
  async function initSSE () {
    var url = api.baseUrl+'SSE';
    if(localStorage['x-sid']) url += '/'+localStorage['x-sid'];
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.message = data.message;
      console.log('Полученные данные:', data);
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };
  }

  return {
    initSSE
  }
}
