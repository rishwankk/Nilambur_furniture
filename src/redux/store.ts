import { configureStore } from '@reduxjs/toolkit';
import specialOffersReducer from './slices/SpecialOfferSlice';
import { Product } from '../types/product';

export interface RootState {
  specialOffers: {
    products: Product[];
  };
}

export const store = configureStore({
  reducer: {
    specialOffers: specialOffersReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
