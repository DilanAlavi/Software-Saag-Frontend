const ANCHO = 32;

export interface ItemTicket {
  nombre: string;
  cantidad: number;
  unidadVenta: string | null;
  unidadVentaTamano: number | null;
  precioUnitario: number;
  total: number;
}

export interface DatosTicket {
  id: number;
  fecha: string | Date;
  cliente: string;
  atendidoPor: string;
  sucursal: string;
  items: ItemTicket[];
  total: number;
}

function centrar(texto: string): string {
  const espacio = Math.max(0, ANCHO - texto.length);
  return ' '.repeat(Math.floor(espacio / 2)) + texto;
}

function raya(): string {
  return '-'.repeat(ANCHO);
}

function envolver(texto: string): string[] {
  const palabras = texto.split(' ');
  const lineas: string[] = [];
  let actual = '';
  for (const palabra of palabras) {
    const propuesta = actual ? `${actual} ${palabra}` : palabra;
    if (propuesta.length > ANCHO) {
      if (actual) lineas.push(actual);
      actual = palabra;
    } else {
      actual = propuesta;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

function formatearCantidad(cantidad: number, unidadVenta: string | null, unidadVentaTamano: number | null): string {
  const unidad = unidadVenta || 'pc';
  const valor = unidadVentaTamano ? cantidad / unidadVentaTamano : cantidad;
  return `${valor} ${unidad}`;
}

function filaColumnas(col1: string, col2: string, col3: string): string {
  const anchoCol1 = 8;
  const anchoCol2 = 10;
  const anchoCol3 = ANCHO - anchoCol1 - anchoCol2;
  return col1.padEnd(anchoCol1) + col2.padEnd(anchoCol2) + col3.padStart(anchoCol3);
}

export function construirTicket(datos: DatosTicket): string {
  const lineas: string[] = [];

  lineas.push(centrar('PROFORMA'));
  lineas.push(raya());
  lineas.push(`Proforma #${datos.id}`);
  lineas.push(new Date(datos.fecha).toLocaleString());
  lineas.push(`Cliente: ${datos.cliente}`);
  lineas.push(`Atendido: ${datos.atendidoPor}`);
  lineas.push(`Suc: ${datos.sucursal}`);
  lineas.push(raya());

  datos.items.forEach((item, i) => {
    if (i > 0) lineas.push('');
    lineas.push(...envolver(item.nombre));
    lineas.push(filaColumnas('CANT', 'PRECIO', 'TOTAL'));
    lineas.push(
      filaColumnas(
        formatearCantidad(item.cantidad, item.unidadVenta, item.unidadVentaTamano),
        `Bs${item.precioUnitario.toFixed(2)}`,
        `Bs${item.total.toFixed(2)}`,
      ),
    );
  });

  lineas.push(raya());
  lineas.push(`TOTAL: Bs${datos.total.toFixed(2)}`);
  lineas.push(raya());
  lineas.push(centrar('Gracias por su compra!'));
  lineas.push('');
  lineas.push('');
  lineas.push('');

  return lineas.join('\n');
}
