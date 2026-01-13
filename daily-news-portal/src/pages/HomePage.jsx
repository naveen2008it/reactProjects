import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles } from '../features/articles/articlesSlice';
import ArticleCard from '../components/ArticleCard';
import Loading from '../components/Loading';
import { CATEGORIES } from '../utils/validators';

export default function HomePage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.articles);

  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(() => ['All', ...CATEGORIES], []);

  useEffect(() => {
    dispatch(fetchArticles({ q, category }));
  }, [dispatch, q, category]);

  return (
    <section style={{ display: 'grid', gap: 14 }}>
      <div className="panel">
        <div className="panel-header">
          <div>
            <h1 className="h1">Top Stories</h1>
            <p className="p">Browse the latest articles. Use search and category filters.</p>
          </div>
          <div className="row">
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title / content..."
            />
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {status === 'loading' && <Loading lines={8} />}
      {status === 'failed' && (
        <div className="panel">
          <div className="error">Failed to load: {error}</div>
          <div className="muted">Make sure JSON Server is running: <code>npm run dev</code></div>
        </div>
      )}

      {status === 'succeeded' && (
        <div className="grid">
          {items.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}

      {status === 'succeeded' && items.length === 0 && (
        <div className="panel">
          <div className="muted">No articles found. Try a different search.</div>
        </div>
      )}
    </section>
  );
}
