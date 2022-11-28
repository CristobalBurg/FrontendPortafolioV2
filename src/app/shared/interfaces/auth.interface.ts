export class LoginData {
    username: string;
    password: string;

    constructor(loginData: LoginData){}
}

export interface Usuario {
    rutUsuario: string;
    username:   string;
    password:   string;
    password2?:   string;
    nombre:     string;
    apellido:   string;
    email:      string;
    telefono:   string;
    isAdmin:    number;
    authorities: any[];
    
}