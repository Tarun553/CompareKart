import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    platform: {
      type: String,
      required: true,
      enum: ['AMAZON', 'FLIPKART', 'GOOGLE_SHOPPING', 'MYNTRA', 'AJIO', 'SNAPDEAL']
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    url: {
      type: String,
      required: true
    },
    inStock: {
      type: Boolean,
      default: true
    },
    lastChecked: {
      type: Date,
      default: Date.now
    },
    priceHistory: [{
      price: Number,
      date: {
        type: Date,
        default: Date.now
      }
    }]
  }, {
    timestamps: true
  });
  
  // Compound index for efficient queries
  priceSchema.index({ productId: 1, platform: 1 });
  priceSchema.index({ lastChecked: 1 });

  export default mongoose.model("Price", priceSchema)