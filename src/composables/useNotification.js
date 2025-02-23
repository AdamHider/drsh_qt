import { reactive } from 'vue'
import { api } from '../services/index'
const notifications = reactive({
  achievements: [],
  levels: [],
  skills: []
})

export function useNotification () {
  function initSSE () {
    var url = api.baseUrl+'SSE';
    if(localStorage['x-sid']) url += '/'+localStorage['x-sid'];

    //url = api.baseUrl+'ssetest.php';
    const evtSource = new EventSource(url, { withCredentials: true });
    evtSource.addEventListener('achievement', (event) => {
      if(event.data){
        notifications.achievements.push(JSON.parse(event.data));
      } else {
        notifications.achievements = [];
      }
      console.log(notifications.achievements)
    });
    evtSource.addEventListener('level', (event) => {
      if(event.data){
        notifications.levels.push(JSON.parse(event.data));
      } else {
        notifications.levels = [];
      }
      console.log(notifications.levels)
    });
    evtSource.addEventListener('skill', (event) => {
      if(event.data){
        notifications.skills.push(JSON.parse(event.data));
      } else {
        notifications.skills = [];
      }
    });
    evtSource.addEventListener('tick', (event) => {
      console.log(event.data)
    });
    evtSource.onerror = (event) => {
      console.error(event)
    }
  }

  return {
    initSSE,
    notifications
  }
}
