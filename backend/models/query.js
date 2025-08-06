import mongoose from "mongoose";

const searchQuerySchema = new mongoose.Schema({
    query: {
      type: String,
      required: true,
      trim: true
    },
    results: {
      type: Number,
      default: 0
    },
    userIP: String,
    responseTime: Number // in milliseconds
  }, {
    timestamps: true
  });
  
  searchQuerySchema.index({ createdAt: -1 });
  searchQuerySchema.index({ query: 1 });

  export default mongoose.model("SearchQuery", searchQuerySchema)