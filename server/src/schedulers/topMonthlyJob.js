import cron from "node-cron";
import { saveTopTracks } from "../services/topSync.js";
import { getTopHits } from "../services/scraper.js";

export function startTopMonthlyJob() {
    cron.schedule(
        "10 3 1 * *",
        async () => {
            try {
                const tracks = await getTopHits();

                if (!Array.isArray(tracks) || !tracks.length) {
                    console.log("⚠️ No tracks received");
                    return;
                }

                const res = await saveTopTracks(tracks);

                console.log("✅ Top monthly sync:", res);
            } catch (e) {
                console.error("❌ Top monthly sync error:", e?.message || e);
            }
        },
        { timezone: "Asia/Tashkent" }
    );

    console.log("🕒 Top monthly job scheduled");
}

export async function runTopSyncNow() {
    try {
        const tracks = await getTopHits();

        if (!Array.isArray(tracks) || !tracks.length) {
            console.log("⚠️ No tracks received");
            return;
        }

        const res = await saveTopTracks(tracks);

        console.log("🔥 Manual Top sync:", res);
        return res;
    } catch (e) {
        console.error("❌ Manual Top sync error:", e?.message || e);
    }
}