export interface DesgloseTotal {

    totalDias: number,
    totalGeneral: number;
    totalServiciosExtra: number;
    totalSinServiciosExtra: number;
    totalAnticipo: number;
    
}
export interface ReporteVenta {
    id_departamento:       number;
    departamento?: string;
    comuna?: string;
    dias:                  number;
    ingresos:              number;
    fecha_primera_reserva: string;
    fecha_ultima_reserva:  string;
    numero_reservas:       number;
}
