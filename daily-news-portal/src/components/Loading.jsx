import React from 'react';

export default function Loading({ lines = 6 }) {
  return (
    <div className="panel">
      <div style={{ display: 'grid', gap: 10 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 14 + (i % 3) * 5 }} />
        ))}
      </div>
    </div>
  );
}
