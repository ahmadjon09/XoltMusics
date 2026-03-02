import bcrypt from "bcryptjs";
import User from "../../database/models/User.js";
import { signAccessToken } from "../utils/jwt.js";
import { t } from '../utils/t.js';
function sanitizeUser(doc) {
    const u = doc.toObject ? doc.toObject() : doc;
    delete u.passwordHash;
    return u;
}

export async function register(req, res) {
    const { username, password, firstName = "", lastName = "", language = "en" } = req.body;

    if (!username || typeof username !== "string" || username.length < 3) {
        return res.status(400).json({ message: t(req.lang, "INVALID_USERNAME") });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ message: t(req.lang, "INVALID_PASSWORD") });
    }
    if (!["uz", "ru", "en"].includes(language)) {
        return res.status(400).json({ message: t(req.lang, "INVALID_LANGUAGE") });
    }

    const exists = await User.findOne({ username }).lean();
    if (exists) return res.status(409).json({ message: t(req.lang, "USERNAME_EXISTS") });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        passwordHash,
        firstName,
        lastName,
        language,
        lastActive: new Date(),
    });

    const token = signAccessToken({ sub: user._id.toString(), username: user.username });

    return res.status(201).json({
        token,
        user: sanitizeUser(user),
    });
}

export async function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ message: t(req.lang, "USERNAME_AND_PASSWORD_REQUIRED") });

    const user = await User.findOne({ username }).select("+passwordHash");
    if (!user) return res.status(401).json({ message: t(req.lang, "INVALID_CREDENTIALS") });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: t(req.lang, "INVALID_CREDENTIALS") });

    user.lastActive = new Date();
    await user.save();

    const token = signAccessToken({ sub: user._id.toString(), username: user.username });

    return res.json({
        token,
        user: sanitizeUser(user),
    });
}

export async function getMe(req, res) {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: t(req.lang, "USER_NOT_FOUND") });
    return res.json({ user: sanitizeUser(user) });
}

export async function updateMe(req, res) {
    const patch = {};
    const { firstName, lastName, language } = req.body;

    if (typeof firstName === "string") patch.firstName = firstName;
    if (typeof lastName === "string") patch.lastName = lastName;
    if (language !== undefined) {
        if (!["uz", "ru", "en"].includes(language)) return res.status(400).json({ message: t(req.lang, "INVALID_LANGUAGE") });
        patch.language = language;
    }

    patch.lastActive = new Date();

    const user = await User.findByIdAndUpdate(req.user.id, patch, { new: true });
    if (!user) return res.status(404).json({ message: t(req.lang, "USER_NOT_FOUND") });
    return res.json({ user: sanitizeUser(user) });
}

export async function changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: t(req.lang, "OLD_AND_NEW_PASSWORD_REQUIRED") });
    if (typeof newPassword !== "string" || newPassword.length < 6) {
        return res.status(400).json({ message: t(req.lang, "INVALID_NEW_PASSWORD") });
    }

    const user = await User.findById(req.user.id).select("+passwordHash");
    if (!user) return res.status(404).json({ message: t(req.lang, "USER_NOT_FOUND") });

    const ok = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!ok) return res.status(401).json({ message: t(req.lang, "OLD_PASSWORD_INCORRECT") });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.lastActive = new Date();
    await user.save();

    return res.json({ message: t(req.lang, "PASSWORD_UPDATED") });
}

// -------- Favorites --------
export async function addFavorite(req, res) {
    const track = req.body;
    if (!track?.trackId) return res.status(400).json({ message: t(req.lang, "TRACK_ID_REQUIRED") });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: t(req.lang, "USER_NOT_FOUND") });

    const exists = user.favorites.some((t) => t.trackId === track.trackId);
    if (!exists) user.favorites.unshift({ ...track, addedAt: new Date() });

    user.lastActive = new Date();
    await user.save();

    return res.json({ favorites: user.favorites });
}

export async function removeFavorite(req, res) {
    const { trackId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: t(req.lang, "USER_NOT_FOUND") });

    user.favorites = user.favorites.filter((t) => t.trackId !== trackId);
    user.lastActive = new Date();
    await user.save();

    return res.json({ favorites: user.favorites });
}

// -------- Recently Played (max 50) --------
export async function pushRecentlyPlayed(req, res) {
    const track = req.body;
    if (!track?.trackId) return res.status(400).json({ message: t(req.lang, "TRACK_ID_REQUIRED") });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: t(req.lang, "USER_NOT_FOUND") });

    // remove old same trackId, then unshift
    user.recentlyPlayed = user.recentlyPlayed.filter((t) => t.trackId !== track.trackId);
    user.recentlyPlayed.unshift({ ...track, addedAt: new Date() });

    // limit
    if (user.recentlyPlayed.length > 50) user.recentlyPlayed = user.recentlyPlayed.slice(0, 50);

    user.lastActive = new Date();
    await user.save();

    return res.json({ recentlyPlayed: user.recentlyPlayed });
}

// -------- Playlists CRUD --------
export async function createPlaylist(req, res) {
    const { name, description = "" } = req.body;
    if (!name || typeof name !== "string") return res.status(400).json({ message: t(req.lang, "PLAYLIST_NAME_REQUIRED") });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: t(req.lang, "USER_NOT_FOUND") });

    user.playlists.unshift({
        name,
        description,
        tracks: [],
        createdAt: new Date(),
    });

    user.lastActive = new Date();
    await user.save();

    return res.status(201).json({ playlists: user.playlists });
}

export async function deletePlaylist(req, res) {
    const { index } = req.params;
    const i = Number(index);
    if (!Number.isInteger(i)) return res.status(400).json({ message: t(req.lang, "PLAYLIST_INDEX_MUST_BE_INTEGER") });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: t(req.lang, "USER_NOT_FOUND") });

    if (i < 0 || i >= user.playlists.length) return res.status(404).json({ message: t(req.lang, "PLAYLIST_NOT_FOUND") });

    user.playlists.splice(i, 1);
    user.lastActive = new Date();
    await user.save();

    return res.json({ playlists: user.playlists });
}

export async function addTrackToPlaylist(req, res) {
    const { index } = req.params;
    const i = Number(index);
    const track = req.body;

    if (!Number.isInteger(i)) return res.status(400).json({ message: t(req.lang, "PLAYLIST_INDEX_MUST_BE_INTEGER") });
    if (!track?.trackId) return res.status(400).json({ message: t(req.lang, "TRACK_ID_REQUIRED") });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: t(req.lang, "USER_NOT_FOUND") });
    if (i < 0 || i >= user.playlists.length) return res.status(404).json({ message: t(req.lang, "PLAYLIST_NOT_FOUND") });

    const pl = user.playlists[i];
    const exists = pl.tracks.some((t) => t.trackId === track.trackId);
    if (!exists) pl.tracks.push({ ...track, addedAt: new Date() });

    user.lastActive = new Date();
    await user.save();

    return res.json({ playlist: pl });
}

export async function removeTrackFromPlaylist(req, res) {
    const { index, trackId } = req.params;
    const i = Number(index);

    if (!Number.isInteger(i)) return res.status(400).json({ message: t(req.lang, "PLAYLIST_INDEX_MUST_BE_INTEGER") });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: t(req.lang, "USER_NOT_FOUND") });
    if (i < 0 || i >= user.playlists.length) return res.status(404).json({ message: t(req.lang, "PLAYLIST_NOT_FOUND") });

    const pl = user.playlists[i];
    pl.tracks = pl.tracks.filter((t) => t.trackId !== trackId);

    user.lastActive = new Date();
    await user.save();

    return res.json({ playlist: pl });
}