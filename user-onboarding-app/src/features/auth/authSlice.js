import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../services/api';

const STORAGE_KEY = 'onboard_user';

function loadFromStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const sendOtp = createAsyncThunk('auth/sendOtp', async (email, { rejectWithValue }) => {
  try {
    const data = await apiRequest('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const storedUser = loadFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    pendingEmail: null,
    pendingRegistration: null,
    otpSent: false,
    loading: false,
    error: null,
  },
  reducers: {
    setPendingEmail(state, action) {
      state.pendingEmail = action.payload;
      state.otpSent = false;
      state.error = null;
    },
    setPendingRegistration(state, action) {
      state.pendingRegistration = action.payload;
    },
    logout(state) {
      state.user = null;
      state.pendingEmail = null;
      state.pendingRegistration = null;
      state.otpSent = false;
      sessionStorage.removeItem(STORAGE_KEY);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send OTP';
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'OTP verification failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { setPendingEmail, setPendingRegistration, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
