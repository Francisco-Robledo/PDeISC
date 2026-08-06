import './BusinessCard.css';

interface BusinessCardProps {
  nombre: string;
  apellido: string;
  profesion: string;
  imagen: string;
}

export default function BusinessCard({ nombre, apellido, profesion, imagen }: BusinessCardProps) {
  return (
    <div className="business-card">
      <div className="card-image-container">
        <img src={imagen} alt={`${nombre} ${apellido}`} className="card-image" />
      </div>
      <div className="card-info">
        <h3>{nombre} {apellido}</h3>
        <p className="profession">{profesion}</p>
      </div>
    </div>
  );
}
