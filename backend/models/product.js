// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Fashion', 'Home', 'Books', 'Sports', 'General']
  },
  imageUrl: {
    type: String
  },
  prices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Price'
  }],
  searchQueries: [String], // For better matching
  averageRating: {
    type: Number,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });

export default mongoose.model('Product', productSchema);