// routes/users.routes.js
import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
    register,
    login,
    getMe,
    updateMe,
    changePassword,
    addFavorite,
    removeFavorite,
    pushRecentlyPlayed,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
} from "../controllers/user.controller.js";

const router = Router();

// AUTH
router.post("/auth/register", register);
router.post("/auth/login", login);

// ME
router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateMe);
router.post("/me/password", requireAuth, changePassword);


router.post("/me/favorites", requireAuth, addFavorite);
router.delete("/me/favorites/:trackId", requireAuth, removeFavorite);


router.post("/me/recently-played", requireAuth, pushRecentlyPlayed);


router.post("/me/playlists", requireAuth, createPlaylist);
router.delete("/me/playlists/:index", requireAuth, deletePlaylist);
router.post("/me/playlists/:index/tracks", requireAuth, addTrackToPlaylist);
router.delete("/me/playlists/:index/tracks/:trackId", requireAuth, removeTrackFromPlaylist);

export default router;