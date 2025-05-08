import mongoose, { Document, Schema } from 'mongoose';

export interface CategoryDocument extends Document {
  name: string;
  description: string;
  createdAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true, unique: true}
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model<CategoryDocument>('Category', CategorySchema);

export default Category;
