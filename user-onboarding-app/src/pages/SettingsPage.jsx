import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';

const SETTINGS = [
  {
    section: 'Notifications',
    items: [
      { key: 'emailNotif', label: 'Email Notifications', description: 'Receive updates via email' },
      { key: 'pushNotif', label: 'Push Notifications', description: 'Browser push alerts' },
      { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Summary email every Monday' },
    ],
  },
  {
    section: 'Privacy',
    items: [
      { key: 'profilePublic', label: 'Public Profile', description: 'Let others find your profile' },
      { key: 'activityVisible', label: 'Activity Visible', description: 'Show recent activity to others' },
    ],
  },
  {
    section: 'Appearance',
    items: [
      { key: 'darkMode', label: 'Dark Mode', description: 'Switch to dark colour scheme' },
      { key: 'compactView', label: 'Compact View', description: 'Reduce spacing in lists' },
    ],
  },
];

const DEFAULTS = {
  emailNotif: true,
  pushNotif: false,
  weeklyDigest: true,
  profilePublic: false,
  activityVisible: false,
  darkMode: false,
  compactView: false,
};

export default function SettingsPage() {
  const [prefs, setPrefs] = useState(DEFAULTS);

  function toggle(key) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="page page--dashboard">
      <header className="page__header">
        <h2 className="page__title">Settings</h2>
      </header>

      {SETTINGS.map(({ section, items }) => (
        <section className="settings-section" key={section}>
          <h3 className="settings-section__title">{section}</h3>
          <ul className="settings-list">
            {items.map(({ key, label, description }) => (
              <li key={key} className="settings-item">
                <div>
                  <p className="settings-item__label">{label}</p>
                  <p className="settings-item__desc">{description}</p>
                </div>
                <button
                  className={`toggle${prefs[key] ? ' toggle--on' : ''}`}
                  onClick={() => toggle(key)}
                  aria-label={`Toggle ${label}`}
                  role="switch"
                  aria-checked={prefs[key]}
                >
                  <span className="toggle__thumb" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <BottomNav />
    </div>
  );
}
