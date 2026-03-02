import crypto from "crypto";
import Top from "../../database/models/Top.js";

function buildTrackId(performer, title) {
    const raw = `${performer || ""}-${title || ""}`.toLowerCase().trim();
    return crypto.createHash("sha1").update(raw).digest("hex");
}

function normalizeTrack(t, fetchedAt = new Date()) {
    return {
        trackId: buildTrackId(t.performer, t.title),
        index: Number.isFinite(t.index) ? t.index : 0,
        performer: String(t.performer || ""),
        title: String(t.title || ""),
        name: String(t.name || `${t.performer || ""} - ${t.title || ""}`).trim(),
        audio_url: String(t.audio_url || ""),
        fetchedAt,
        source: "monthly-fetch",
    };
}

/**
 * @param {Array} tracks incoming array from API
 * @returns {Object} { insertedOrUpdated, skipped }
 */
export async function saveTopTracks(tracks) {
    const fetchedAt = new Date();
    const list = Array.isArray(tracks) ? tracks : [];

    // basic filter
    const cleaned = list
        .map((t) => normalizeTrack(t, fetchedAt))
        .filter((t) => t.audio_url);

    if (!cleaned.length) return { insertedOrUpdated: 0, skipped: list.length };

    // bulk upsert
    const ops = cleaned.map((t) => ({
        updateOne: {
            filter: { trackId: t.trackId },
            update: { $set: t },
            upsert: true,
        },
    }));

    const r = await Top.bulkWrite(ops, { ordered: false });


    const insertedOrUpdated =
        (r.upsertedCount || 0) +
        (r.modifiedCount || 0) +
        (r.matchedCount || 0);

    return { insertedOrUpdated, skipped: list.length - cleaned.length };
}