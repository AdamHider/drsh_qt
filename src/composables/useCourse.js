import { reactive } from 'vue'
import { api } from '../services'
const course = reactive({
    list: []
});

export function useCourse() {
    async function getList () {
        try{
            const courseResponse = await api.course.getList();
            course.list = courseResponse.data;
        } catch(e){
            console.log(e)
            throw new Error(`Courses are null: `+e); 
        }      
    }
    
    return {
        getList,
        course
    }
}