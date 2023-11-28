import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './Store';
import axios from 'axios';

interface WeatherState {
  data: any; 
  loading: boolean;
  error: string | null;
  city: string;
}

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null,
  city: '',
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    fetchWeatherStart: (state) => {
      state.loading = true;
    },
    fetchWeatherSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
      state.city = action.payload.city_name;
    },
    fetchWeatherFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.data = null;
      state.error = action.payload;
    },
  },
});

export const { fetchWeatherStart, fetchWeatherSuccess, fetchWeatherFailure } = weatherSlice.actions;

export const fetchWeatherData = (city: string): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchWeatherStart());
    const response = await axios.get(
      `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=d308159d1aca4ece9a846c78d087bc1f`
    );
    dispatch(fetchWeatherSuccess(response.data));
  } catch (error:any) {
    dispatch(fetchWeatherFailure(error.message));
  }
};

export default weatherSlice.reducer;
