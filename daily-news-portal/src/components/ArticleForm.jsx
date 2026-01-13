import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CATEGORIES, articleSchema } from '../utils/validators';

export default function ArticleForm({ initialValues, onSubmit, submitLabel }) {
  const defaultValues = useMemo(
    () => ({
      title: '',
      category: 'World',
      author: '',
      imageUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=60',
      summary: '',
      content: '',
      ...initialValues
    }),
    [initialValues]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues,
    resolver: yupResolver(articleSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="panel" style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'grid', gap: 6 }}>
        <label>Title</label>
        <input className="input" placeholder="Enter title" {...register('title')} />
        {errors.title && <div className="error">{errors.title.message}</div>}
      </div>

      <div className="row">
        <div style={{ display: 'grid', gap: 6, flex: 1 }}>
          <label>Category</label>
          <select className="select" {...register('category')}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <div className="error">{errors.category.message}</div>}
        </div>

        <div style={{ display: 'grid', gap: 6, flex: 1 }}>
          <label>Author</label>
          <input className="input" placeholder="Enter author" {...register('author')} />
          {errors.author && <div className="error">{errors.author.message}</div>}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        <label>Image URL</label>
        <input className="input" placeholder="https://..." {...register('imageUrl')} />
        {errors.imageUrl && <div className="error">{errors.imageUrl.message}</div>}
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        <label>Summary</label>
        <textarea className="textarea" placeholder="Short summary" {...register('summary')} />
        {errors.summary && <div className="error">{errors.summary.message}</div>}
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        <label>Content</label>
        <textarea className="textarea" placeholder="Full article content" {...register('content')} />
        {errors.content && <div className="error">{errors.content.message}</div>}
      </div>

      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button className="btn primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
