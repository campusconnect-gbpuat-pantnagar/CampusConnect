const mongoose = require("mongoose")

const pollSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  options: [
    {
      text: { type: String, required: true },
      votes: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        }
      ],
    }
  ],
  created: {
    type: Date,
    default: Date.now
  },
  totalVotes: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model("Poll", pollSchema);
