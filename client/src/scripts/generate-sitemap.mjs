import fs from "fs";
import path from "path";


const SITE_URL = ("https://music.xolt.uz").replace(/\/+$/, "");

// static route'lar
const ROUTES = [
    "",            // /
    "top-tracks",  // /top-tracks
    "login",       // /login
    "register",    // /register
];

// musiqalar keladigan API (sen qo'yasan)
const TRACKS_API = "http://localhost:3000/api/en/v1/top"

function isoNow() {
    return new Date().toISOString();
}

function escXml(s) {
    return String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function urlTag(loc, lastmod) {
    return [
        "<url>",
        `  <loc>${escXml(loc)}</loc>`,
        `  <lastmod>${escXml(lastmod)}</lastmod>`,
        "</url>",
    ].join("\n");
}

async function getTracks() {
    if (!TRACKS_API) return [];

    const res = await fetch(TRACKS_API, { headers: { "accept": "application/json" } });
    if (!res.ok) throw new Error(`TRACKS_API HTTP ${res.status}`);

    const data = await res.json();

    const list = Array.isArray(data) ? data : (data || data.data || []);
    return Array.isArray(list) ? list : [];
}

async function main() {
    const lastmod = isoNow();
    const urls = [];

    for (const r of ROUTES) {
        const loc = `${SITE_URL}${r ? `/${r}` : ""}`;
        urls.push(urlTag(loc, lastmod));
    }

    const tracks = await getTracks();

    const MAX_TRACK_URLS = Number(process.env.SITEMAP_MAX_TRACKS || 5000);

    for (const t of tracks.slice(0, MAX_TRACK_URLS)) {
        const title = String(t?.title || "").trim();
        if (!title) continue;

        const loc = `${SITE_URL}/search?q=${encodeURIComponent(title)}`;
        urls.push(urlTag(loc, lastmod));
    }

    const xml =
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

    const outDir = path.resolve(process.cwd(), "public");
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml, "utf-8");

    const robots =
        `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
    fs.writeFileSync(path.join(outDir, "robots.txt"), robots, "utf-8");

    console.log(`✅ sitemap.xml (${urls.length} urls) va robots.txt -> public/`);
}

main().catch((e) => {
    console.error("❌ Sitemap generate error:", e?.message || e);
    process.exit(1);
});