import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  mrp: number;
  offerPrice: number;
  stock: number;
  category: Types.ObjectId; // Use Types.ObjectId here
  images: string[];
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  mrp: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true ,index: true},

  images: [{ type: String, required: true }],
});

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
