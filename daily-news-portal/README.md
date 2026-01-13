# Daily News Portal (CRA + Redux Toolkit + React Router + JSON Server)

A simple Daily News Portal built with **Create React App**, **Redux Toolkit**, **React Router**, **JSON Server** (mock backend), **React Hook Form + Yup** validation, and **React Toastify**.

## Features

- Browse latest news
- Filter by category
- Search by title
- View article details
- Admin-like pages to add/edit/delete articles (local mock backend)
- Client-side form validation
- Toast notifications for actions

## Tech Stack

- React (Create React App)
- Redux Toolkit + RTK Query optional pattern (this project uses `createAsyncThunk` for clarity)
- React Router v6
- JSON Server
- react-hook-form + yup
- react-toastify

## Getting Started

### 1) Install

```bash
cd daily-news-portal
npm install
```

### 2) Run App + API (recommended)

```bash
npm run dev
```

This starts:
- React app on http://localhost:3000
- JSON Server API on http://localhost:4000

### 3) Run only API

```bash
npm run server
```

### 4) Run only React app

```bash
npm start
```

## API Endpoints

Base URL: `http://localhost:4000`

- `GET /articles`
- `GET /articles/:id`
- `POST /articles`
- `PUT /articles/:id`
- `DELETE /articles/:id`

Query examples:
- `GET /articles?q=india` (full-text search)
- `GET /articles?category=World&_sort=publishedAt&_order=desc`

## Project Structure

```
daily-news-portal/
  server/
    db.json
  src/
    app/
      store.js
    features/
      articles/
        articlesSlice.js
    pages/
      HomePage.jsx
      ArticleDetailsPage.jsx
      AdminArticlesPage.jsx
      ArticleFormPage.jsx
      NotFoundPage.jsx
    components/
      Navbar.jsx
      ArticleCard.jsx
      ArticleForm.jsx
      Loading.jsx
    utils/
      validators.js
    App.js
    index.js
```

## Notes

- This uses JSON Server as a mock backend. Data is stored in `server/db.json`.
- If port 4000 is busy, update `server` script in `package.json` and `src/services/api.js`.
