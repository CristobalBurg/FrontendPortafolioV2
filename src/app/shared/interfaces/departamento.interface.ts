export interface Departamento {
    idDepartamento:           number;
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
    idComuna:    number;
    idProvincia: number;
    nombre:      string;
}

export interface InventarioProducto {
    idInventarioProducto: number;
    producto:             Producto;
    cantidad:             number;
}

export interface Producto {
    idProducto: number;
    valor:      number;
    nombre:     string;
}