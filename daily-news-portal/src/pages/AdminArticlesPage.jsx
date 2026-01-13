import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteArticle, fetchArticles } from '../features/articles/articlesSlice';
import { toast } from 'react-toastify';
import { CATEGORIES } from '../utils/validators';

export default function AdminArticlesPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.articles);

  const [category, setCategory] = useState('All');
  const categories = useMemo(() => ['All', ...CATEGORIES], []);

  useEffect(() => {
    dispatch(fetchArticles({ category }));
  }, [dispatch, category]);

  async function handleDelete(id) {
    const ok = window.confirm('Delete this article?');
    if (!ok) return;

    try {
      await dispatch(deleteArticle(id)).unwrap();
      toast.success('Article deleted');
    } catch (e) {
      toast.error(e.message || 'Failed to delete');
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h1 className="h1">Admin: Articles</h1>
          <p className="p">Create, edit, and delete articles stored in JSON Server.</p>
        </div>
        <div className="row">
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Link className="btn primary" to="/admin/articles/new">+ New Article</Link>
        </div>
      </div>

      {status === 'failed' && <div className="error">Failed to load: {error}</div>}

      <table className="table" style={{ marginTop: 6 }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.id}>
              <td>
                <div style={{ fontWeight: 700 }}>{a.title}</div>
                <div className="muted" style={{ fontSize: 13 }}>By {a.author}</div>
              </td>
              <td><span className="badge">{a.category}</span></td>
              <td className="muted" style={{ fontSize: 13 }}>{new Date(a.publishedAt).toLocaleString()}</td>
              <td>
                <div className="row">
                  <Link className="btn" to={`/articles/${a.id}`}>View</Link>
                  <Link className="btn" to={`/admin/articles/${a.id}/edit`}>Edit</Link>
                  <button className="btn danger" onClick={() => handleDelete(a.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}

          {status === 'succeeded' && items.length === 0 && (
            <tr>
              <td colSpan={4} className="muted">No articles found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
