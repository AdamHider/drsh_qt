import { reactive } from 'vue'
import { api } from '../services/index'
const achievements = reactive({
    list: [],
    limit: 8,
    offset: 0
});


export function useAchievement() {
    
    async function getList (index) {
        achievements.offset = achievements.limit * index;
        try{
            const achievementListResponse = await api.achievements.getList({limit: achievements.limit, offset: achievements.offset});
            achievements.list = achievements.list.concat(achievementListResponse.data);
            return achievementListResponse.data.length == 0;
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