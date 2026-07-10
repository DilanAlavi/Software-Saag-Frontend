import { useNavigate } from 'react-router-dom';
import { ListadoVentas } from '../components/ListadoVentas';

function fechaDeHoy(): string {
  const ahora = new Date();
  const offset = ahora.getTimezoneOffset();
  const local = new Date(ahora.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

export function VentasDelDiaPage() {
  const navigate = useNavigate();

  return (
    <ListadoVentas
      titulo="Ventas del día"
      fechaFija={fechaDeHoy()}
      mensajeVacio="Todavía no hay ventas registradas hoy."
      accionExtra={
        <button className="btn btn-primary" onClick={() => navigate('/panel/ventas/nueva')}>
          + Nueva venta
        </button>
      }
    />
  );
}
