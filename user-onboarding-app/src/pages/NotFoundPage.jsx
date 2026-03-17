import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page page--center">
      <div className="not-found">
        <div className="not-found__code">404</div>
        <h2 className="not-found__title">Page Not Found</h2>
        <p className="not-found__msg">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn--primary">Go Home</Link>
      </div>
    </div>
  );
}
