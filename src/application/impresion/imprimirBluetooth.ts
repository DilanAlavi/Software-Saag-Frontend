// Servicios GATT mas comunes usados por impresoras termicas Bluetooth de bajo costo
// (varian segun el chip interno; probamos todos los conocidos y detectamos automaticamente
// cual characteristic de escritura expone el modelo real).
const SERVICIOS_CONOCIDOS = [
  '000018f0-0000-1000-8000-00805f9b34fb',
  '0000ff00-0000-1000-8000-00805f9b34fb',
  '0000ffe0-0000-1000-8000-00805f9b34fb',
  '49535343-fe7d-4ae5-8fa9-9fafd205e455',
];

const ESC = 0x1b;
const GS = 0x1d;
const TAMANO_BLOQUE = 20;

const RANGO_DIACRITICOS = new RegExp('[̀-ͯ]', 'g');

function quitarAcentos(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(RANGO_DIACRITICOS, '')
    .replace(/ñ/g, 'n')
    .replace(/Ñ/g, 'N');
}

function construirBytesEscPos(texto: string): Uint8Array {
  const limpio = quitarAcentos(texto);
  const encoder = new TextEncoder();
  // Bastante papel de sobra antes de cortar: si no se alimenta lo suficiente,
  // la cuchilla puede quedar justo donde termino de imprimir y no tener nada que cortar.
  const cuerpo = encoder.encode(`${limpio}\n\n\n\n\n`);
  const init = new Uint8Array([ESC, 0x40]); // inicializa la impresora
  // Se mandan dos variantes del comando de corte (distintos modelos usan una u otra);
  // si el modelo no tiene cuchilla, ambas se ignoran sin error.
  const corteA = new Uint8Array([GS, 0x56, 0x42, 0x00]); // corte parcial con avance 0
  const corteB = new Uint8Array([GS, 0x56, 0x00]); // corte total (variante mas vieja/simple)
  const resultado = new Uint8Array(init.length + cuerpo.length + corteA.length + corteB.length);
  resultado.set(init, 0);
  resultado.set(cuerpo, init.length);
  resultado.set(corteA, init.length + cuerpo.length);
  resultado.set(corteB, init.length + cuerpo.length + corteA.length);
  return resultado;
}

async function buscarCaracteristicaEscritura(servidor: any): Promise<any> {
  const servicios = await servidor.getPrimaryServices();
  for (const servicio of servicios) {
    const caracteristicas = await servicio.getCharacteristics();
    const encontrada = caracteristicas.find((c: any) => c.properties.write || c.properties.writeWithoutResponse);
    if (encontrada) return encontrada;
  }
  return null;
}

export async function imprimirTicket58mm(texto: string): Promise<void> {
  if (!('bluetooth' in navigator)) {
    throw new Error('Este navegador no soporta impresion Bluetooth. Usa Chrome o Edge (no funciona en Safari/iPhone).');
  }

  const bluetooth = (navigator as any).bluetooth;
  const dispositivo = await bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: SERVICIOS_CONOCIDOS,
  });

  const servidor = await dispositivo.gatt.connect();
  try {
    const caracteristica = await buscarCaracteristicaEscritura(servidor);
    if (!caracteristica) {
      throw new Error('No se encontro un canal de escritura en la impresora. Puede que este modelo no sea compatible.');
    }

    const bytes = construirBytesEscPos(texto);
    for (let i = 0; i < bytes.length; i += TAMANO_BLOQUE) {
      const bloque = bytes.slice(i, i + TAMANO_BLOQUE);
      if (caracteristica.properties.writeWithoutResponse) {
        await caracteristica.writeValueWithoutResponse(bloque);
      } else {
        await caracteristica.writeValue(bloque);
      }
    }
  } finally {
    servidor.disconnect();
  }
}
