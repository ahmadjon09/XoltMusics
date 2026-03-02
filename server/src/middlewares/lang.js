
const SUPPORTED = new Set(["uz", "ru", "en"])
const DEFAULT_LANG = "en"

export default function langMiddleware(req, res, next) {
    const lang = (req.params?.lang || "").toLowerCase()
    req.lang = SUPPORTED.has(lang) ? lang : DEFAULT_LANG
    next()
}