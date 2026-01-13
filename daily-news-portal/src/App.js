import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import ArticleDetailsPage from './pages/ArticleDetailsPage';
import AdminArticlesPage from './pages/AdminArticlesPage';
import ArticleFormPage from './pages/ArticleFormPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles/:id" element={<ArticleDetailsPage />} />
          <Route path="/admin/articles" element={<AdminArticlesPage />} />
          <Route path="/admin/articles/new" element={<ArticleFormPage mode="create" />} />
          <Route path="/admin/articles/:id/edit" element={<ArticleFormPage mode="edit" />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}
