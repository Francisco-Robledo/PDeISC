import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/Toast';
import { FloatingThemeToggle } from './components/FloatingThemeToggle';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { DetailPage } from './pages/DetailPage';
import { CreateTaskPage } from './pages/CreateTaskPage';
import { EditTaskPage } from './pages/EditTaskPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 light-mesh-bg transition-colors duration-200">
      <Navbar />

      <main className="flex-1 app-container w-full pb-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/task/:id" element={<DetailPage />} />
          <Route path="/task/:id/edit" element={<EditTaskPage />} />
          <Route path="/create" element={<CreateTaskPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <ToastContainer />
      <FloatingThemeToggle />
      <ScrollToTop />

      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md py-6 transition-colors">
        <div className="app-container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p className="font-medium">
            R2ANTI Task Manager &copy; {new Date().getFullYear()} — React 19 + React Router DOM v7
          </p>
          <div className="flex items-center gap-4">
            <span>Modo Claro/Oscuro</span>
            <span>&bull;</span>
            <span>Exportación a JSON/CSV</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <TaskProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default App;
