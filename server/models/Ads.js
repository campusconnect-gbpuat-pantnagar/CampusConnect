const mongoose = require("mongoose")

const adsSchema = new mongoose.Schema(
  {
    objType: {
      type: String,
      default: "ads",
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      max: 50,
    },
    content: {
      type: String,
      max: 3000,
    },
    is_safe: {
			type: Boolean,
			default: false
		},
    contact: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
    },
    media: [
			{
				url: {
					type: String,
					default: null
				},
				format: {
					type: String,
					default: null
				},
				publicId: {
					type: String,
					default: null
				},
				resource_type: {
					type: String,
					default: null
				},
				thumbnail_url: {
					type: String,
					default: null
				},
				asset_id: {
					type: String,
					default: null
				},
			}
		],
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model("Ads", adsSchema)
