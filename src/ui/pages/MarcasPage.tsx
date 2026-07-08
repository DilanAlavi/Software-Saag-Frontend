import { useMarcasProductos } from '../../application/producto/useMarcasProductos';

export function MarcasPage() {
  const { marcas, cargando } = useMarcasProductos();

  return (
    <div>
      <h1>Marcas</h1>

      {cargando ? (
        <p>Cargando...</p>
      ) : marcas.length === 0 ? (
        <p>Todavía no hay marcas registradas en ningún producto.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', maxWidth: 420, borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#1a1a1a', color: '#faf6ef', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px' }}>Marca</th>
              </tr>
            </thead>
            <tbody>
              {marcas.map((marca) => (
                <tr key={marca} style={{ borderBottom: '1px solid #e8e0d3' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>{marca}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
