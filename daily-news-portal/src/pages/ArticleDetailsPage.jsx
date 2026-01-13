import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelected, fetchArticleById } from '../features/articles/articlesSlice';
import Loading from '../components/Loading';

export default function ArticleDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected, status, error } = useSelector((s) => s.articles);

  useEffect(() => {
    dispatch(fetchArticleById(id));
    return () => dispatch(clearSelected());
  }, [dispatch, id]);

  if (status === 'loading' && !selected) return <Loading lines={10} />;

  if (status === 'failed') {
    return (
      <div className="panel">
        <div className="error">Failed to load article: {error}</div>
        <div style={{ marginTop: 10 }}>
          <Link className="btn" to="/">Back</Link>
        </div>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="panel">
        <div className="muted">Article not found.</div>
        <div style={{ marginTop: 10 }}>
          <Link className="btn" to="/">Back</Link>
        </div>
      </div>
    );
  }

  const a = selected;

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div className="panel">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="badge">{a.category}</span>
          <span className="muted" style={{ fontSize: 13 }}>{new Date(a.publishedAt).toLocaleString()}</span>
        </div>
        <h1 className="h1" style={{ marginTop: 10 }}>{a.title}</h1>
        <div className="muted">By {a.author}</div>
      </div>

      <div className="panel">
        <img
          alt={a.title}
          src={a.imageUrl}
          style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 14, border: '1px solid var(--border)' }}
        />
      </div>

      <div className="panel">
        <h2 className="h2">Summary</h2>
        <p className="p">{a.summary}</p>
      </div>

      <div className="panel">
        <h2 className="h2">Full Story</h2>
        <p className="p" style={{ whiteSpace: 'pre-wrap' }}>{a.content}</p>
        <div style={{ marginTop: 12 }}>
          <Link className="btn" to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
