// model/Banner.ts
import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);

export default Banner;
