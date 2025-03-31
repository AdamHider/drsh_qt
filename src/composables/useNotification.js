import { ref } from 'vue'
import { api } from '../services/index'
const notifications = ref({
  achievement: {},
  level: {},
  skill: {}
})

var evtSource = null;

export function useNotification () {
  var url = '';

  function initSSE () {

    if(!localStorage['x-sid']) return

    url = api.baseUrl+'SSE/'+localStorage['x-sid'];

    evtSource = new EventSource(url, { withCredentials: true });

    evtSource.addEventListener('achievement', (event) => {
      if(event.data){
        notifications.value.achievement = JSON.parse(event.data);
      } else {
        notifications.value.achievement = {};
      }
    });
    evtSource.addEventListener('level', (event) => {
      if(event.data){
        notifications.value.level = JSON.parse(event.data);
      } else {
        notifications.value.level = {};
      }
    });
    evtSource.addEventListener('skill', (event) => {
      if(event.data){
        notifications.value.skill = JSON.parse(event.data);
      } else {
        notifications.value.skill = {};
      }
    });
    evtSource.addEventListener('quest', (event) => {
      if(event.data){
        notifications.value.quest = JSON.parse(event.data);
      } else {
        notifications.value.quest = {};
      }
    });
    evtSource.addEventListener('invitation', (event) => {
      if(event.data){
        notifications.value.invitation = JSON.parse(event.data);
      } else {
        notifications.value.invitation = {};
      }
    });
    evtSource.addEventListener('tick', (event) => {
      console.log(event.data)
    });
    evtSource.onerror = (event) => {
      console.error(event)
    }
  }
  function closeSSE () {
    evtSource.close();
  }

  return {
    initSSE,
    closeSSE,
    notifications
  }
}
