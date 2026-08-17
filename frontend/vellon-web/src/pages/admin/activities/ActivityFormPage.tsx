import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { activityService, type CreateActivityInput } from '../../../services/activityService';

export default function ActivityFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateActivityInput>({
    defaultValues: { isActive: true },
  });

  useEffect(() => {
    if (isEdit) {
      activityService.getById(Number(id)).then((a) => {
        reset({
          title: a.title,
          description: a.description,
          activityDate: a.activityDate.split('T')[0],
          imageUrl: a.imageUrl ?? '',
          isActive: a.isActive,
        });
      });
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: CreateActivityInput) => {
    if (isEdit) {
      await activityService.update(Number(id), data);
    } else {
      await activityService.create(data);
    }
    navigate('/admin/activities');
  };

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? 'Editar actividad' : 'Nueva actividad'}</h1>
        <button className="btn-secondary" onClick={() => navigate('/admin/activities')}>← Volver</button>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Título *</label>
            <input {...register('title', { required: 'El título es requerido.' })} />
            {errors.title && <p className="form-error">{errors.title.message}</p>}
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea {...register('description', { required: 'La descripción es requerida.' })} rows={4} />
            {errors.description && <p className="form-error">{errors.description.message}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha de la actividad *</label>
              <input type="date" {...register('activityDate', { required: 'La fecha es requerida.' })} />
              {errors.activityDate && <p className="form-error">{errors.activityDate.message}</p>}
            </div>
            <div className="form-group">
              <label>URL de imagen</label>
              <input type="url" {...register('imageUrl')} placeholder="https://..." />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" {...register('isActive')} />
              Visible en el sitio público
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear actividad'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/admin/activities')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
