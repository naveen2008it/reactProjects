import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from '../features/articles/articlesSlice';

export const store = configureStore({
  reducer: {
    articles: articlesReducer
  }
});
