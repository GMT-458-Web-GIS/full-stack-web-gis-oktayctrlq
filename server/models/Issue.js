const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    photo: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", IssueSchema);
