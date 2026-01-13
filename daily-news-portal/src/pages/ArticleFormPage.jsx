import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import ArticleForm from '../components/ArticleForm';
import { apiRequest } from '../services/api';
import { createArticle, updateArticle } from '../features/articles/articlesSlice';
import Loading from '../components/Loading';

export default function ArticleFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(mode === 'edit');
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (mode !== 'edit') return;
      try {
        setLoading(true);
        const data = await apiRequest(`/articles/${id}`);
        if (active) setInitialValues(data);
      } catch (e) {
        toast.error('Failed to load article');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [mode, id]);

  async function handleSubmit(values) {
    const nowIso = new Date().toISOString();

    try {
      if (mode === 'create') {
        await dispatch(
          createArticle({
            ...values,
            publishedAt: nowIso
          })
        ).unwrap();
        toast.success('Article created');
      } else {
        await dispatch(
          updateArticle({
            id,
            changes: {
              ...initialValues,
              ...values,
              updatedAt: nowIso
            }
          })
        ).unwrap();
        toast.success('Article updated');
      }

      navigate('/admin/articles');
    } catch (e) {
      toast.error(e.message || 'Failed to save');
    }
  }

  if (loading) return <Loading lines={10} />;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="panel">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h1 className="h1">{mode === 'create' ? 'New Article' : 'Edit Article'}</h1>
            <p className="p">Validation is handled by React Hook Form + Yup.</p>
          </div>
          <Link className="btn" to="/admin/articles">Back</Link>
        </div>
      </div>

      <ArticleForm
        initialValues={initialValues || undefined}
        onSubmit={handleSubmit}
        submitLabel={mode === 'create' ? 'Create' : 'Update'}
      />
    </div>
  );
}
