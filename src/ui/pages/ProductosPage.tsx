import { FormEvent, useState } from 'react';
import { useProductos } from '../../application/producto/useProductos';

export function ProductosPage() {
  const { productos, cargando, crear } = useProductos();
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await crear({ nombre, precio: Number(precio), stock: Number(stock) });
    setNombre('');
    setPrecio('');
    setStock('');
  };

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Productos</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input placeholder="Precio" type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
        <input placeholder="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        <button type="submit">Agregar</button>
      </form>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {productos.map((p) => (
            <li key={p.id}>
              {p.nombre} — precio: {p.precio} — stock: {p.stock}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
