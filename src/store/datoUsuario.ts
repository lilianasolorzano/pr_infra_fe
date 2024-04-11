import { defineStore } from 'pinia';
import { IduserIAM, IdUsuario, secretUserIAM } from '../types';
// import { IdUsuario } from '../types';
// import Cookies from 'js-cookie'
import Cookies from 'js-cookie';

export const usedataStore = defineStore({
    id: 'datos',
    state: () => ({
        // logeo de usuario 
        usuario: null,
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
        // editar usuario IAM, obtener solo el usuario a editar
        dataEditIAM: [] as IduserIAM[],
        dataSecretIAM: [] as secretUserIAM[],
        //  registrar dato de usuario IAM 
        dataIAM: [{
            UserId: '',
            UserName: '',
            accessKeyId: '',
            secretKey: '',
            date: '',
        }],
        isLoggedIn: Cookies.get('isLoggedIn') === 'true' || false,
        role: Cookies.get('role') || '',
        //    logeo de usuario 
        //    usuario: null,
        //    rol: null,
    }),
    actions: {

        reset() {
            this.$reset();
        },

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
        clearUserIdIAM() {
            this.dataUsersIAM = []
        },
        clearUserIdDataIAM() {
            this.dataIAM = []
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
        // guardar datos editados de usuarios 
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
        userSecretIA(iam_access_key: string, iam_user_name: string, secret_access_key: string, status: string) {
            this.dataSecretIAM.push({
                iam_access_key,
                iam_user_name,
                secret_access_key,
                status
            })
        },
        // guardar datos editados de usuarios IAM secret
        userEditIAM(saveDataEditIAM: IduserIAM) {
            this.dataEditIAM.push(saveDataEditIAM)
        },
        userSecretIAM(dataSecretIAM: secretUserIAM) {
            this.dataSecretIAM.push(dataSecretIAM)
        },
        // eliminar un acces_key 
        deleteAccessKey(iam_user_name: string, iam_access_key: string) {
            this.dataSecretIAM.push({
                iam_user_name,
                iam_access_key,
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

        setLoggedIn(role: string) {
            // this.isLoggedIn = isLoggedIn
            this.isLoggedIn = true;
            if (role) {
                this.role = role;
                Cookies.set('role', role, { expires: 1 });
            }
            Cookies.set('isLoggedIn', 'true', { expires: 1 });
        },

        logout() {
            this.isLoggedIn = false;
            this.role = ''
            Cookies.remove('isLoggedIn');
        },

    },

})