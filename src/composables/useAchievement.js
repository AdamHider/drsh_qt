import { reactive } from 'vue'
import { api } from '../services/index'
const achievements = reactive({
    list: []
});

export function useAchievement() {
    async function getList () {
        try{
            const achievementListResponse =  await api.achievements.getList();
            achievements.list = achievementListResponse.data;
        } catch(e){
            console.log(e)
            throw new Error(`Courses are null: `+e); 
        }      
    }
    
    return {
        getList,
        achievements
    }
}