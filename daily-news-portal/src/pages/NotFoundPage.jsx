import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="panel" style={{ textAlign: 'center' }}>
      <h1 className="h1">404</h1>
      <p className="p">Page not found.</p>
      <div style={{ marginTop: 12 }}>
        <Link className="btn primary" to="/">Go Home</Link>
      </div>
    </div>
  );
}
