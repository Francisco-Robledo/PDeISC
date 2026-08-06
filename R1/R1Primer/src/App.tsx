import HolaMundo from './components/holaMundo';
import BusinessCard from './components/BusinessCard';
import Counter from './components/Counter';
import TodoList from './components/TodoList';
import SimpleForm from './components/SimpleForm';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Dashboard React</h1>
        <p>Proyectos Prácticos R1 - Implementación Profesional</p>
      </header>
      
      <main className="grid-container">
        <section className="grid-item">
          <HolaMundo />
        </section>
        <section className="grid-item">
          <BusinessCard 
            nombre="Desarrollador" 
            apellido="Pro" 
            profesion="Full Stack React Developer" 
            imagen="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
          />
        </section>
        <section className="grid-item">
          <Counter />
        </section>
        <section className="grid-item">
          <TodoList />
        </section>
        <section className="grid-item">
          <SimpleForm />
        </section>
      </main>
    </div>
  );
}

export default App;