const mongoose = require("mongoose");
require("mongoose-type-url");

const streamSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		organizer: {
			type: String,
		},
		date: {
			type: String,
			required: true,
		},
		time: {
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
		type: {
			type: String,
			required: true,
		},
		attendees: {
			type: Number,
			default: 0,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Stream", streamSchema);
