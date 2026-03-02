import { verifyAccessToken } from "../utils/jwt.js";
import { t } from "../utils/t.js"
export function requireAuth(req, res, next) {
    try {
        const h = req.headers.authorization || "";
        const [, token] = h.split(" ");

        if (!token) return res.status(401).json({ message: t(req.lang, "UNAUTHORIZED") });

        const payload = verifyAccessToken(token);
        req.user = { id: payload.sub, username: payload.username };
        next();
    } catch (err) {
        return res.status(401).json({ message: t(req.lang, "UNAUTHORIZED") });
    }
}