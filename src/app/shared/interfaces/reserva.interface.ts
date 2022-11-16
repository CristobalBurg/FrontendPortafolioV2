export interface Reserva {
    fechaLlegada:         string;
    fechaEntrega:         string;
    departamento:         Departamento;
    reservaServicioExtra: any[];
    reservaPagos:         ReservaPago[];
    usuario:              Usuario;


}

export interface Departamento {
    idDepartamento: number;
}

export interface ReservaPago {
    pago: Pago;
}

export interface Pago {
    tipoPago:  string;
    monto:     number;
    medioPago: string;
}

export interface Usuario {
    rutUsuario: string;
}