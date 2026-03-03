import mongoose from "mongoose";

const AllSchema = new mongoose.Schema(
    {
        trackId: { type: String, required: true, unique: true, index: true },

        index: { type: Number, default: 0 },
        performer: { type: String, default: "" },
        title: { type: String, default: "" },
        name: { type: String, default: "" },
        audio_url: { type: String, required: true, index: true, unique: true },

        source: { type: String, default: "monthly-fetch" },
        fetchedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("All", AllSchema);