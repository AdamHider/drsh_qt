import { reactive } from 'vue'
import { api } from '../services/index'
const notifications = reactive({
  achievements: {list: []},
  levels: {list: []},
  skills: {list: []}
})

export function useNotification () {
  function initSSE () {
    var url = api.baseUrl+'SSE';
    if(localStorage['x-sid']) url += '/'+localStorage['x-sid'];

    //url = api.baseUrl+'ssetest.php';
    const evtSource = new EventSource(url, { withCredentials: true });
    evtSource.addEventListener('achievement', (event) => {
      if(event.data){
        notifications.achievements.list = JSON.parse(event.data);
      } else {
        notifications.achievements.list = [];
      }
    });
    evtSource.addEventListener('level', (event) => {
      if(event.data){
        notifications.levels.list = JSON.parse(event.data);
      } else {
        notifications.levels.list = [];
      }
    });
    evtSource.addEventListener('skill', (event) => {
      console.log(event.data)
      if(event.data){
        notifications.skills.list = JSON.parse(event.data);
      } else {
        notifications.skills.list = [];
      }
    });
    evtSource.addEventListener('tick', (event) => {
      console.log(event.data)
    });
    evtSource.onerror = (event) => {
      console.error(event)
    }
  }
  function removeFromList (code, id){
    const newList = [];
    for(var i in notifications[code].list){
      if(notifications[code].list[i].id !== id) newList.push(notifications[code].list[i])
    }
    notifications[code].list = newList
  }
  function clearLists (lists){
    console.log(lists)
    for(var i in lists){
      notifications[lists[i]].list = []
    }
  }


  return {
    initSSE,
    removeFromList,
    clearLists,
    notifications
  }
}
