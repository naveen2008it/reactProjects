import React from 'react';
import { useSelector } from 'react-redux';
import BottomNav from '../components/BottomNav';

export default function ProfilePage() {
  const { user } = useSelector((s) => s.auth);
  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const fields = [
    { label: 'Full Name', value: user?.fullName || '—' },
    { label: 'Email', value: user?.email || '—' },
    { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
    { label: 'Account Status', value: '✅ Verified' },
  ];

  return (
    <div className="page page--dashboard">
      <header className="page__header">
        <h2 className="page__title">My Profile</h2>
      </header>

      <div className="profile-avatar-wrap">
        <div className="profile-avatar">{initials}</div>
        <p className="profile-name">{user?.fullName}</p>
        <p className="profile-email">{user?.email}</p>
      </div>

      <ul className="profile-fields">
        {fields.map((f) => (
          <li key={f.label} className="profile-field">
            <span className="profile-field__label">{f.label}</span>
            <span className="profile-field__value">{f.value}</span>
          </li>
        ))}
      </ul>

      <BottomNav />
    </div>
  );
}
