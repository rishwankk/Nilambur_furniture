"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type Product = {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  discountPercentage: number;
};


interface SpecialOfferState {
  products: Product[];
}


const initialState: SpecialOfferState = {
  products: [], 
};

const specialOfferSlice = createSlice({
  name: "specialOffers",
  initialState,
  reducers: {
    setSpecialOffers: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload; 
    },
  },
});


export const { setSpecialOffers } = specialOfferSlice.actions;


export default specialOfferSlice.reducer;
