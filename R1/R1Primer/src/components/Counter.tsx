import { useState } from 'react';
import './Counter.css';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-component">
      <h3>Contador interactivo</h3>
      <div className="counter-display">
        <span className="count-value">{count}</span>
      </div>
      <div className="counter-controls">
        <button onClick={() => setCount(c => c - 1)} className="btn-decrement">-</button>
        <button onClick={() => setCount(c => c + 1)} className="btn-increment">+</button>
      </div>
    </div>
  );
}
