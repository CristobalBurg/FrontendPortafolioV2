export interface Departamento {
    idDepartamento: number;
    ctdHabitaciones: number;
    valorArriendoDia: number;
    politicasCondiciones: string;
    foto: string;
    comuna: Comuna[];
    inventarioProductos: InventarioProducto[];
    departamentoMantenciones: DepartamentoMantencion[];
}

export interface Comuna {
    idComuna:number;
    nombre:string;
}

export interface InventarioProducto {
    idInventarioProducto: number
}

export interface DepartamentoMantencion {
    idDepartamentoMantencion: number;
}