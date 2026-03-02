import { motion, AnimatePresence } from "framer-motion";
import {
    Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
    Heart, Repeat, Shuffle, ChevronDown, ChevronUp, ListMusic, Mic2, Disc3
} from "lucide-react";
import { useState, useRef } from "react";
import { useMusic } from "../context/MusicContext";
import { useTranslation } from "../hooks/UseLanguage";

export const MusicPlayer = () => {
    const {
        currentTrack,
        isPlaying,
        setIsPlaying,
        playNext,
        playPrev,
        isPlayerExpanded,
        setIsPlayerExpanded,
        isLiked,
        toggleLike,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
        progress,
        duration,
        currentTime,
        isShuffle,
        setIsShuffle,
        isRepeat,
        setIsRepeat,
        queue,
        seekTo,
        playTrack, // <-- BUNI contextdan ber
    } = useMusic();

    const [showPlaylist, setShowPlaylist] = useState(false);

    const miniProgressRef = useRef(null);
    const expandedProgressRef = useRef(null);

    const handleProgressClick = (ref) => (e) => {
        if (!ref.current || !duration) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, x / rect.width));
        seekTo(pct * duration);
    };

    const formatTime = (time) => {
        const t = Number(time || 0);
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60);
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const { t } = useTranslation();
    if (!currentTrack) return null;

    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-50"
        >
            {/* Mini Player */}
            {!isPlayerExpanded && (
                <motion.div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
                    <div className="container mx-auto px-3 sm:px-4">
                        <div className="flex items-center gap-2 sm:gap-3 py-2 sm:py-3">
                            <div className="relative">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md">
                                    {currentTrack.title?.charAt(0) || "M"}
                                </div>
                                <motion.div
                                    animate={{ scale: isPlaying ? [1, 1.2, 1] : 1 }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute -inset-1 bg-indigo-400/20 rounded-lg"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-800 text-xs sm:text-sm truncate">
                                    {currentTrack.title}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">{currentTrack.performer}</p>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-4">
                                <button onClick={playPrev} className="hidden xs:block p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
                                    <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                                </button>

                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 shadow-md"
                                >
                                    {isPlaying ? (
                                        <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    ) : (
                                        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" />
                                    )}
                                </button>

                                <button onClick={playNext} className="hidden xs:block p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
                                    <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                                </button>

                                <button onClick={() => setIsPlayerExpanded(true)} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
                                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={miniProgressRef}
                            onClick={handleProgressClick(miniProgressRef)}
                            className="h-1 bg-gray-200 rounded-full cursor-pointer relative group"
                        >
                            <div className="h-full bg-indigo-600 rounded-full relative" style={{ width: `${progress}%` }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Expanded Player */}
            {isPlayerExpanded && (
                <motion.div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
                    <div className="container mx-auto px-4 py-4 sm:py-6">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{t("nowPlaying")}</h3>
                            <button onClick={() => setIsPlayerExpanded(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                            <div className="md:w-1/2">
                                {!showPlaylist && (
                                    <div className="max-w-[280px] sm:max-w-[300px] mx-auto mb-6">
                                        <div className="relative aspect-square">
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center">
                                                <Disc3 className="w-20 h-20 sm:w-24 sm:h-24 text-white/30" />
                                            </div>
                                            <motion.div
                                                animate={{ rotate: isPlaying ? 360 : 0 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-0 rounded-2xl border-4 border-white/20"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{currentTrack.title}</h2>
                                    <p className="text-gray-600 flex items-center justify-center gap-2">
                                        <Mic2 className="w-4 h-4" />
                                        {currentTrack.performer}
                                    </p>
                                </div>

                                <div className="flex justify-center mb-6">
                                    <button
                                        onClick={() => toggleLike(currentTrack.index)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200"
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${isLiked[currentTrack.index] ? "fill-red-500 text-red-500" : "text-gray-600"
                                                }`}
                                        />
                                        <span className="text-sm text-gray-700">
                                            {isLiked[currentTrack.index] ? "Liked" : "Like"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="md:w-1/2">
                                <div className="mb-6">
                                    <div
                                        ref={expandedProgressRef}
                                        onClick={handleProgressClick(expandedProgressRef)}
                                        className="h-2 bg-gray-200 rounded-full cursor-pointer relative group"
                                    >
                                        <div className="h-full bg-indigo-600 rounded-full relative" style={{ width: `${progress}%` }}>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100 shadow-lg" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8">
                                    <button
                                        onClick={() => setIsShuffle(!isShuffle)}
                                        className={`p-2 sm:p-3 rounded-full ${isShuffle ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`}
                                    >
                                        <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>

                                    <button onClick={playPrev} className="p-2 sm:p-3 hover:bg-gray-100 rounded-full">
                                        <SkipBack className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                                    </button>

                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 shadow-lg"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                        ) : (
                                            <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-1" />
                                        )}
                                    </button>

                                    <button onClick={playNext} className="p-2 sm:p-3 hover:bg-gray-100 rounded-full">
                                        <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                                    </button>

                                    <button
                                        onClick={() => setIsRepeat(!isRepeat)}
                                        className={`p-2 sm:p-3 rounded-full ${isRepeat ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}`}
                                    >
                                        <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <button onClick={() => setIsMuted(!isMuted)} className="p-2 hover:bg-gray-100 rounded-full">
                                        {isMuted || volume === 0 ? (
                                            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                        ) : (
                                            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                        )}
                                    </button>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={isMuted ? 0 : volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        className="w-24 sm:w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>

                                <button
                                    onClick={() => setShowPlaylist(!showPlaylist)}
                                    className="w-full flex items-center justify-center gap-2 p-2 rounded-lg border hover:bg-gray-50"
                                >
                                    <ListMusic className="w-4 h-4" />
                                    {t("playlist") || "Playlist"}
                                </button>

                                <AnimatePresence>
                                    {showPlaylist && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-4 border-t border-gray-200 pt-4"
                                        >
                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {queue.map((track) => (
                                                    <div
                                                        key={track.index}
                                                        onClick={() => {
                                                            playTrack(track, queue);
                                                            setShowPlaylist(false);
                                                        }}
                                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${currentTrack.index === track.index ? "bg-indigo-50" : "hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">
                                                            {track.title?.charAt(0) || "M"}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-gray-800 text-sm truncate">{track.title}</div>
                                                            <div className="text-xs text-gray-500 truncate">{track.performer}</div>
                                                        </div>
                                                        {currentTrack.index === track.index && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};