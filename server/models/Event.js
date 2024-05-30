const mongoose = require("mongoose");
require("mongoose-type-url");

const eventSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		date: {
			type: String,
			required: true,
		},
		venue: {
			type: String,
			required: true,
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
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
