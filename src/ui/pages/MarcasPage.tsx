import { useMarcasProductos } from '../../application/producto/useMarcasProductos';

export function MarcasPage() {
  const { marcas, cargando } = useMarcasProductos();

  return (
    <div>
      <div className="page-header">
        <h1>Marcas</h1>
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : marcas.length === 0 ? (
        <p>Todavía no hay marcas registradas en ningún producto.</p>
      ) : (
        <div className="table-wrap" style={{ maxWidth: 420 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Marca</th>
              </tr>
            </thead>
            <tbody>
              {marcas.map((marca) => (
                <tr key={marca}>
                  <td style={{ fontWeight: 700 }}>{marca}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
