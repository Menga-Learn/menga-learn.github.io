import { Link } from 'react-router-dom';
import { EmptyState } from '../components/Layout';

export function NotFoundPage() {
  return (
    <EmptyState title="Pagina non trovata">
      <p>
        Il contenuto che cerchi non esiste o è stato spostato. <Link to="/">Torna alle certificazioni</Link>.
      </p>
    </EmptyState>
  );
}
