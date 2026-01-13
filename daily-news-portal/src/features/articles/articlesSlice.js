import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

const initialState = {
  items: [],
  selected: null,
  status: 'idle',
  error: null
};

export const fetchArticles = createAsyncThunk('articles/fetchAll', async (params = {}) => {
  const { q = '', category = 'All', sort = 'publishedAt', order = 'desc' } = params;

  const qs = new URLSearchParams();
  if (q) qs.set('q', q);
  if (category && category !== 'All') qs.set('category', category);
  qs.set('_sort', sort);
  qs.set('_order', order);

  return apiRequest(`/articles?${qs.toString()}`);
});

export const fetchArticleById = createAsyncThunk('articles/fetchById', async (id) => {
  return apiRequest(`/articles/${id}`);
});

export const createArticle = createAsyncThunk('articles/create', async (payload) => {
  return apiRequest('/articles', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
});

export const updateArticle = createAsyncThunk('articles/update', async ({ id, changes }) => {
  return apiRequest(`/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...changes, id: Number(id) })
  });
});

export const deleteArticle = createAsyncThunk('articles/delete', async (id) => {
  await apiRequest(`/articles/${id}`, { method: 'DELETE' });
  return Number(id);
});

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(fetchArticleById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selected = action.payload;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(createArticle.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        const idx = state.items.findIndex((a) => a.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload);
        if (state.selected?.id === action.payload) state.selected = null;
      });
  }
});

export const { clearSelected } = articlesSlice.actions;
export default articlesSlice.reducer;
