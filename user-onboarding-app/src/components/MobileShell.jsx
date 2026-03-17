import React from 'react';

export default function MobileShell({ children }) {
  return (
    <div className="mobile-viewport">
      <div className="mobile-frame">
        {children}
      </div>
    </div>
  );
}
