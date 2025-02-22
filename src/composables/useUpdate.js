import { reactive } from 'vue'
import { api } from '../services/index'
const achievement = reactive({
  list: [],
  limit: 8,
  offset: 0
})

export function useUpdate () {
  function initSSE () {
    var url = api.baseUrl+'SSE';
    if(localStorage['x-sid']) url += '/'+localStorage['x-sid'];
    const eventSource = new EventSource(url);

    eventSource.addEventListener("ping", function(event) {
      console.log('ping:', event.data);
    });
    eventSource.onmessage = (event) => {

      const data = JSON.parse(event.data);
      console.log('Полученные данные:', data);
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);

    };
  }
  function initWebSocket() {
    const ws = new WebSocket('ws://mektepium-app.local:8080');

    ws.onmessage = (event) => {
      console.log('Полученные данные WebSocket:', event.data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  return {
    initSSE,
    initWebSocket
  }
}
