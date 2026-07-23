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
  const cuerpo = encoder.encode(`${limpio}\n`);
  const init = new Uint8Array([ESC, 0x40]); // inicializa la impresora
  // Este modelo no tiene cuchilla de corte automatico: en vez de mandar el comando de
  // corte (que no hace nada), avanzamos ~2,5cm de papel en blanco para poder cortar a mano
  // comodo. ESC J n avanza n dots (aprox 0,125mm cada uno en la mayoria de impresoras
  // termicas de 203dpi); n=200 son unos 25mm.
  const avancePapel = new Uint8Array([ESC, 0x4a, 200]);
  const resultado = new Uint8Array(init.length + cuerpo.length + avancePapel.length);
  resultado.set(init, 0);
  resultado.set(cuerpo, init.length);
  resultado.set(avancePapel, init.length + cuerpo.length);
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
