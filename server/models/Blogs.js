const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
	{
		objType: {
			type: String,
			default: "blog",
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
			required: true,
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
		link: {
			type: String,
			default: null,
		},
		upvotes: [
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
		shareCount: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
