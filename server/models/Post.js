const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		objType: {
			type: String,
			default: "post",
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			max: 3000,
		},
		is_safe: {
			type: Boolean,
			default: false
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
);

module.exports = mongoose.model("Post", postSchema);
