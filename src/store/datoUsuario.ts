import { defineStore } from 'pinia';
import { IdUsuario } from '../types';
import Cookies from 'js-cookie'
export const usedataStore = defineStore({
    id: 'datos',
    state: () => ({
        // logeo de usuario 
        usuario: null,
        rol: null,
        // datos de usuario 
        dataUsers: [{
            id: '',
            user: '',
            email: '',
            password: '',
            role: '',
        }],
        // editar usuario, obtener solo el usuario a editar
        dataEditID: [] as IdUsuario[],

        // datos de usuario IAM    
        dataUsersIAM: [{
            UserId: '',
            UserName: '',
            accessKeyId: '',
            CreateDate: '',
            Status: '',
            ExpirationDate: '',
        }],
        //  registrar dato de usuario IAM 
        dataIAM: [{
            UserId: '',
            UserName: '',
            accessKeyId: '',
            secretKey: '',
            date: '',
        }],
        // isLoggedIn: false
        isLoggedIn: Cookies.get('isLoggedIn') === 'true' || false,
        // isLoggedIn: getCookie('isLoggedIn') === 'true' || false,
        //    logeo de usuario 
        //    usuario: null,
        //    rol: null,
    }),
    actions: {
        // almacenar dato del JSON 
        userJson(id: string, user: string, email: string, password: string, role: string) {
            this.dataUsers.push({
                id,
                user,
                email,
                password,
                role,
            })
        },
        // limpiar usuario
        clearUserIds() {
            this.dataUsers = []
        },
        // guardar un dato 
        userGet(id: string, user: string, email: string, password: string, role: string) {
            this.dataUsers.push(
                {
                    id,
                    user,
                    email,
                    password,
                    role,
                })
        },
        userEdit(saveDataEdit: IdUsuario) {
            this.dataEditID.push(saveDataEdit)
        },
        // metodo para obtener los datos IAM de endpoint
        userIAM(UserId: string, UserName: string, accessKeyId: string, CreateDate: string, Status: string, ExpirationDate: string) {
            this.dataUsersIAM.push({
                UserId,
                UserName,
                accessKeyId,
                CreateDate,
                Status,
                ExpirationDate,
            })
        },
        // registrar usuario 
        saveData(inputEvent) {
            this.dataUsers.push(inputEvent)
        },

        // registrar los usuarios IAM 
        registCredentialIAM(UserName: string, UserId: string, accessKeyId: string, secretKey: string, date: string) {
            this.dataIAM.push({
                UserId,
                UserName,
                accessKeyId,
                secretKey,
                date,

            })
            // console.error('dato erroneo', UserName)

        },
        //   guardar datos de nuevas credenciales 
        saveDataIAM(inputEvent) {
            this.dataIAM.push(inputEvent)
        },
        iniciarSesion(usuario: null) {
            // checar dataUser , puedo que se camibie por datosUsuario 
            const { rol, ...dataUsers } = iniciarSesion(usuario);

            this.setUsuario(dataUsers);
            this.setRol(rol);
        },
        setUsuario(usuario: null) {
            this.usuario = usuario
        },
        setRol(rol: null) {
            this.rol = rol;
        },

        setLoggedIn() {
            // this.isLoggedIn = isLoggedIn
            this.isLoggedIn = true;
            Cookies.set('isLoggedIn', 'true', { expires: 1 });
        }

    },

})