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
export interface IduserIAM {
    UserId: string,
    UserName?: string,
    accessKeyId?: string,
    CreateDate?: string,
    Status?: string,
    ExpirationDate?: string,
};
export interface CredentRegistIAM {
    // hay que colocar los nombre igual que lla endpoint 
    UserId?: string | number,
    userName?: string,
    accessKeyId?: string,
    secretKey?: string,
    date?: string,
    ExpirationDate?: string,
};
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