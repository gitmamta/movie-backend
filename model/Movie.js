const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  rank: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  fullTitle: {
    type: String
  },
  year: {
    type: Number
  },
  image: {
    type: String
  },
  crew: {
    type: String
  },
  imDbRating: {
    type: Number
  },
  imDbRatingCount: {
    type: Number
  }
}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema);
