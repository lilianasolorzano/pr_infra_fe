export interface IdUsuario {
    id?: string,
    user?: string,
    email?: string,
    password?: string,
    role?: string,

    // id:string,
    // createdAt?:string,
    // updatedAt?:string,
    // user?:string,
    // password?:string,
    // code?:string,
    // role?:string,
    // email?:string,
};
export interface IduserIAM{
// interfaz reutilizable, acceskeyId es el unico que no se utiliza en visualizeCredIAM
    UserId?:string,
    UserName?:string,
    accessKeyId?:string, 
    CreateDate?:string,
    Status?:string,
    ExpirationDate?:string,
};
export interface secretUserIAM{

    iam_user_name ?: string,
    iam_access_key?: string,
    secret_access_key?: string,
    status?:string
};

// export interface ApiResponse {
//   IduserIAM: IduserIAM[];
//   secretUserIAM: secretUserIAM[];
// }
export interface CredentRegistIAM{
    // hay que colocar los nombre igual que lla endpoint 
    UserId?:string | number,
    UserName?:string,
    accessKeyId?:string,
    secretKey?: string,
    date?: string,
    ExpirationDate?:string,
    
};
export interface CreatRegistIAM{
    // hay que colocar los nombre igual que lla endpoint 
    UserId?:string | number,
    userName?:string,
    accessKeyId?:string,
    secretKey?: string,
    date?: string,
    ExpirationDate?:string,
    
};

// export interface IduserIAM {
//     UserId: string,
//     UserName?: string,
//     accessKeyId?: string,
//     CreateDate?: string,
//     Status?: string,
//     ExpirationDate?: string,
// };
// export interface CredentRegistIAM {
//     // hay que colocar los nombre igual que lla endpoint 
//     UserId?: string | number,
//     userName?: string,
//     accessKeyId?: string,
//     secretKey?: string,
//     date?: string,
//     ExpirationDate?: string,
// };
export interface inicioSesion {
    user: string,
    password: string
}

export interface UserData {
    data: {
        userDTO: {
            role: string;
        };
    };
}