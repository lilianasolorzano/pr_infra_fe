import { defineStore } from 'pinia';
export const usedataStore = defineStore({
    id: 'datos',
    state: () => ({
        dataUsers:[{
            id:'',
            user:'',
            email:'',
            role:'',
        }]
    }),
    actions:{
        userJson(id:string, user:string , email:string, role:string){
            this.dataUsers.push({
                id,
                user,
                email,
                role,
            })
        },
        clearUserIds() {
            this.dataUsers = []
       },
       user(id:string ,user:string, email:string, role:string){
        this.dataUsers.push(
            {
                id,
                user, 
                email,
                role,
            })
    },

    }

})