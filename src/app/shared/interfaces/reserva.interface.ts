export interface Reserva {
    idReserva?:            number;
    fechaLlegada:         string;
    fechaEntrega:         string;
    departamento:         Departamento;
    usuario:              Usuario;
    reservaServicioExtra: ReservaServicioExtra[];
    reservaPagos:         ReservaPago[];
    checkedIn:            boolean;
    checkedOut:           boolean;
    ctdAcomanantes:       number;
    transportista:        Transportista;
}

export interface Departamento {
    idDepartamento?:           number;
    direccion:                string;
    ctdHabitaciones:          number;
    ctdBanos:                 number;
    valorArriendoDia:         number;
    tamano:                   number;
    politicasCondiciones:     string;
    foto:                     string;
    comuna:                   Comuna;
    inventarioProductos:      InventarioProducto[];
    departamentoMantenciones: any[];
}

export interface Comuna {
    idComuna?:    number;
    idProvincia: number;
    nombre:      string;
}

export interface InventarioProducto {
    idInventarioProducto?: number;
    producto:             Producto;
    cantidad:             number;
}

export interface Producto {
    idProducto?: number;
    valor:      number;
    nombre:     string;
}

export interface ReservaPago {
    idReservaPago?: number;
    pago:          Pago;
}

export interface Pago {
    idPago?:      number;
    tipoPago:    string;
    monto:       number;
    medioPago:   string;
    fecha?:       string;
    observacion?: string;
}

export interface ReservaServicioExtra {
    idReservaServicioExtra?: number;
    servicioExtra:          ServicioExtra;
    cantidad:               number;
}

export interface ServicioExtra {
    idServicioExtra?: number;
    valor:           number;
    nombre:          string;
    descripcion:     string;
    foto:            string;
    tipoPrecio:      string;
}

export interface Transportista {
    rutTransportista?: string;
    nombre:           string;
    apellido:         string;
    vehiculo:         string;
    fechaDesde:       string;
    fechaHasta:       string;
    contacto:         string;
}

export interface Usuario {
    rutUsuario?:            string;
    username:              string;
    password:              string;
    nombre:                string;
    apellido:              string;
    email:                 string;
    telefono:              string;
    enabled:               boolean;
    perfil:                string;
    isAdmin:               number;
    authorities:           Authority[];
    accountNonExpired:     boolean;
    credentialsNonExpired: boolean;
    accountNonLocked:      boolean;
}

export interface Authority {
    authority?: string;
}

export interface CheckIn {
    idCheckIn?: number;
    reserva : Reserva;
    firmado : boolean;
}

export interface Checkout {
    idCheckout?: number;
    checkin: CheckIn;
    multa: Multa,
    firmado: boolean;

}

export interface Multa {
    idMulta?: number;
    descripcion: string;
    valor: number;
}
