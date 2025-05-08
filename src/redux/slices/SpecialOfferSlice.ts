import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/product';

interface SpecialOfferState {
  products: Product[];
}

const initialState: SpecialOfferState = {
  products: []
};

export const specialOffersSlice = createSlice({
  name: 'specialOffers',
  initialState,
  reducers: {
    setSpecialOffers: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    }
  }
});

export const { setSpecialOffers } = specialOffersSlice.actions;
export default specialOffersSlice.reducer;