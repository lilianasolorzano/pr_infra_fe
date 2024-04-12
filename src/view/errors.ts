// Archivo que contiene los mensajes de error
export const errorMessages = {
     createUserIamError: "No se pudo crear el usuario IAM.",
     createUserError: "No se pudo crear el usuario.",
     generalError: "Ocurrió un error inesperado. Intente nuevamente.",


     successCreateIAM: "Usuario IAM creado con éxito.",
     credential: "Credenciales creada con éxito.",
     createErrCredential: "La credencial no fue creada con exito",

     addCredential: "Credencial agregada exitosamente",
     errorAddCredential: "La credencial no fue agregada con exito",
     excedito: "El usuario a excedido el limite de credenciales",

     deleteUser: "Usuario eliminado con exito",
     deleteErrorUser: "El usuario no fue eliminado",
     deleteUserError: "El usuario IAM no fue eliminado",

     createUser: "Usuario creado con exito",
     // createUserError: "Usuario creado con exito",
} as const
