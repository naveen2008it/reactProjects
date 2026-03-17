import React from 'react';
import { useSelector } from 'react-redux';
import BottomNav from '../components/BottomNav';

const STAT_CARDS = [
  { icon: '📰', label: 'Articles Read', value: '12' },
  { icon: '⭐', label: 'Saved', value: '4' },
  { icon: '🔔', label: 'Notifications', value: '3' },
  { icon: '🏆', label: 'Streak', value: '7 days' },
];

const QUICK_ACTIONS = [
  { icon: '🔍', label: 'Explore', color: '#4f46e5' },
  { icon: '📝', label: 'Write', color: '#059669' },
  { icon: '📤', label: 'Share', color: '#d97706' },
  { icon: '💬', label: 'Community', color: '#db2777' },
];

const RECENT_ITEMS = [
  { title: 'Getting Started Guide', category: 'Onboarding', time: 'Just now' },
  { title: 'Tips for a Productive Day', category: 'Productivity', time: '2h ago' },
  { title: 'How to Manage Notifications', category: 'Settings', time: '1d ago' },
];

export default function DashboardPage() {
  const { user } = useSelector((s) => s.auth);
  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page page--dashboard">
      <header className="dash-header">
        <div>
          <p className="dash-header__greeting">{greeting},</p>
          <h1 className="dash-header__name">{firstName} 👋</h1>
        </div>
        <div className="dash-header__avatar">{firstName[0]?.toUpperCase() || '?'}</div>
      </header>

      <section className="dash-section">
        <div className="stat-grid">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className="stat-card">
              <span className="stat-card__icon">{s.icon}</span>
              <span className="stat-card__value">{s.value}</span>
              <span className="stat-card__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="dash-section">
        <h2 className="dash-section__title">Quick Actions</h2>
        <div className="quick-actions">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              className="quick-action"
              style={{ '--qa-color': a.color }}
            >
              <span className="quick-action__icon">{a.icon}</span>
              <span className="quick-action__label">{a.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="dash-section">
        <h2 className="dash-section__title">Recent Activity</h2>
        <ul className="activity-list">
          {RECENT_ITEMS.map((item) => (
            <li key={item.title} className="activity-item">
              <div>
                <p className="activity-item__title">{item.title}</p>
                <p className="activity-item__meta">{item.category}</p>
              </div>
              <span className="activity-item__time">{item.time}</span>
            </li>
          ))}
        </ul>
      </section>

      <BottomNav />
    </div>
  );
}
