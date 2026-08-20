import React, { useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { TaskForm, type TaskFormValues } from '../components/TaskForm';
import { usePageTitle } from '../hooks/usePageTitle';
import { ArrowLeft, PlusCircle } from 'lucide-react';

interface FormErrors {
  title?: string;
  description?: string;
}

const DEFAULT_VALUES: TaskFormValues = {
  title: '',
  shortDescription: '',
  description: '',
  priority: 'medium',
  category: 'general',
  completed: false,
  dueDate: ''
};

const validate = (values: TaskFormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!values.title.trim()) {
    errors.title = 'El título es obligatorio.';
  } else if (values.title.trim().length < 3) {
    errors.title = 'El título debe tener al menos 3 caracteres.';
  } else if (values.title.trim().length > 100) {
    errors.title = 'El título no debe superar los 100 caracteres.';
  }

  if (!values.description.trim()) {
    errors.description = 'La descripción es obligatoria.';
  } else if (values.description.trim().length < 5) {
    errors.description = 'La descripción debe tener al menos 5 caracteres.';
  }

  return errors;
};

export const CreateTaskPage: React.FC = () => {
  usePageTitle('Nueva Tarea');

  const navigate = useNavigate();
  const { addTask, showToast } = useTasks();

  const [values, setValues] = useState<TaskFormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((patch: Partial<TaskFormValues>) => {
    setValues(prev => ({ ...prev, ...patch }));
    if (patch.title !== undefined && errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
    if (patch.description !== undefined && errors.description) {
      setErrors(prev => ({ ...prev, description: undefined }));
    }
  }, [errors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors = validate(values);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = addTask({
        title: values.title,
        shortDescription: values.shortDescription || undefined,
        description: values.description,
        priority: values.priority,
        category: values.category,
        completed: values.completed,
        dueDate: values.dueDate || undefined
      });
      navigate(`/task/${created.id}`);
    } catch (err) {
      console.error('Error al guardar tarea:', err);
      showToast('Error al guardar la tarea. Intenta de nuevo.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 sm:py-8 space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancelar y Volver
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-sm space-y-6 transition-colors">
        <div className="flex items-center gap-3 pb-5 sm:pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
            <PlusCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Crear Nueva Tarea
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Completa los detalles a continuación para registrar una tarea.
            </p>
          </div>
        </div>

        <TaskForm
          values={values}
          onChange={handleChange}
          errors={errors}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Guardar y Agregar Tarea"
          onCancel={() => navigate('/')}
          submitColorClass="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-blue-600/25"
        />
      </div>
    </div>
  );
};
