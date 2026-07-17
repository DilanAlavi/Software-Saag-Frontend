import {
  HistorialGanancias,
  HistorialGananciasAnual,
  ResumenGananciasDia,
  VentaConGanancia,
} from '../../domain/ganancia/ganancia.entity';

export interface GananciaRepositoryPort {
  resumenDia(fecha?: string): Promise<ResumenGananciasDia>;
  ultimasVentas(limit?: number): Promise<VentaConGanancia[]>;
  historialMensual(desde?: string, hasta?: string): Promise<HistorialGanancias>;
  historialAnual(): Promise<HistorialGananciasAnual>;
}
