import React from 'react';
import { Link } from 'react-router-dom';

export default function ArticleCard({ article }) {
  return (
    <article className="card">
      <div className="card-top">
        <span className="badge">{article.category}</span>
        <span className="muted" style={{ fontSize: 12 }}>{new Date(article.publishedAt).toLocaleString()}</span>
      </div>
      <h3 className="h2">{article.title}</h3>
      <p className="p">{article.summary}</p>
      <div className="row" style={{ justifyContent: 'space-between', marginTop: 'auto' }}>
        <span className="muted" style={{ fontSize: 13 }}>By {article.author}</span>
        <Link className="btn" to={`/articles/${article.id}`}>Read</Link>
      </div>
    </article>
  );
}
