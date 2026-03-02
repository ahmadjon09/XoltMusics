import { useTranslation } from "../hooks/UseLanguage"
import music from "../assets/music_def.webp"
import { motion } from "framer-motion"
import {
    Play,
    Heart,
    Headphones,
    Clock,
    TrendingUp,
    Sparkles
} from "lucide-react"
import { useState, useEffect } from "react"
import { LoadingSkeleton } from "../components/LoadingSkeleton"
import { useNavigate } from "react-router-dom"
import { useMusic } from "../context/MusicContext"
import { useTopTracks } from "../hooks/TopTrack"

export const Home = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { playTrack, isLiked, toggleLike, currentTrack: contextCurrentTrack, isPlaying: contextIsPlaying } = useMusic()
    const { data: tracksSER = [], error, isLoading } = useTopTracks()

    const tracks = tracksSER.data || []
    const [loadingProgress, setLoadingProgress] = useState(0)

    // Loading progress simulation
    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 90) return 90
                    return prev + 10
                })
            }, 200)
            return () => clearInterval(interval)
        } else {
            setLoadingProgress(100)
            setTimeout(() => setLoadingProgress(0), 500)
        }
    }, [isLoading])

    // Play track handler
    const handlePlayTrack = (track) => {
        playTrack(track, tracks)
    }

    // Error handling
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md"
                >
                    <div className="text-7xl mb-6 animate-bounce">🎵</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        {t('errorLoading') || "Unable to load tracks"}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {t('pleaseTryAgain') || "Please check your connection and try again"}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                        {t('refresh') || "Try Again"}
                    </motion.button>
                </motion.div>
            </div>
        )
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Progress Bar */}
                {loadingProgress > 0 && (
                    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${loadingProgress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                )}

                <LoadingSkeleton />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-xl text-sm text-gray-700 border border-gray-100"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span>{t('loading') || "Loading amazing music..."}</span>
                    </div>
                </motion.div>
            </div>
        )
    }

    const topTracks = tracks.slice(0, 10)
    const recentTracks = tracks.slice(10, 15)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-32 md:pb-24">
            {/* Main Content */}
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-10 text-white overflow-hidden">
                        {/* Animated Background Elements */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, 0],
                            }}
                            transition={{
                                duration: 15,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute -right-20 -top-20 w-60 h-60 bg-white/10 rounded-full"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                rotate: [0, -10, 0],
                            }}
                            transition={{
                                duration: 18,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute -left-20 -bottom-20 w-60 h-60 bg-white/10 rounded-full"
                        />

                        {/* Floating particles */}
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: [0, -20, 0],
                                    x: [0, 10, 0],
                                }}
                                transition={{
                                    duration: 4 + i,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                }}
                                className="absolute w-2 h-2 bg-white/30 rounded-full"
                                style={{
                                    top: `${20 + i * 15}%`,
                                    left: `${10 + i * 10}%`,
                                }}
                            />
                        ))}

                        <div className="relative z-10">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="flex items-center gap-2 mb-4 "
                            >
                                <Sparkles className="w-6 h-6" />
                                <span className="text-sm font-medium tracking-wide uppercase">
                                    {t("discoverNewMusic") || "Discover Your Next Favorite Track"}
                                </span>
                            </motion.div>

                            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                                {t('welcome') || "Welcome to XoltMusic"}
                            </h1>

                            <p className="text-base md:text-lg opacity-90 mb-6 max-w-2xl">
                                {t('discover') || "Immerse yourself in a world of unlimited music. Create your perfect playlist and enjoy millions of tracks."}
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/top-tracks')}
                                className="px-8 py-3.5 bg-white text-indigo-600 rounded-xl font-semibold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 group"
                            >
                                <span>{t('getStarted') || "Start Listening"}</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Top Charts Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-12"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                                    {t('topCharts') || "Top Charts"}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {t('mostPopular') || "Most popular tracks this week"}
                                </p>
                            </div>
                        </div>

                        <motion.button
                            onClick={() => navigate('/top-tracks')}
                            whileHover={{ x: 5 }}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl"
                        >
                            {t('viewAll') || "View All"}
                            <span>→</span>
                        </motion.button>
                    </div>

                    {topTracks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16 bg-white rounded-2xl shadow-sm"
                        >
                            <div className="text-7xl mb-4">🎵</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                {t('noTracksFound') || "No tracks available"}
                            </h3>
                            <p className="text-gray-500">
                                {t('checkBackLater') || "Check back later for new music"}
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
                            {topTracks.map((track, index) => (
                                <motion.div
                                    key={track.id || track.index || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -6 }}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="relative aspect-square bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
                                        <img
                                            src={track.cover || music}
                                            alt={track.title}
                                            className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = music
                                            }}
                                        />

                                        {/* Rank Badge with animation */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.1, type: "spring" }}
                                            className="absolute top-3 left-3 w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
                                        >
                                            {index + 1}
                                        </motion.div>

                                        {/* Play Button Overlay */}
                                        <motion.button
                                            onClick={() => handlePlayTrack(track)}
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform">
                                                <Play className="w-6 h-6 md:w-7 md:h-7 text-white ml-1" />
                                            </div>
                                        </motion.button>

                                        {/* Like Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleLike(track.id || track.index)
                                            }}
                                            className="absolute top-3 right-3 p-2 bg-white/95 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            <Heart
                                                className={`w-4 h-4 md:w-4 md:h-4 transition-colors ${isLiked[track.id || track.index]
                                                    ? 'fill-red-500 text-red-500'
                                                    : 'text-gray-600'
                                                    }`}
                                            />
                                        </motion.button>
                                    </div>

                                    <div className="p-3">
                                        <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-1">
                                            {track.title || "Unknown Title"}
                                        </h3>
                                        <p className="text-xs md:text-sm text-gray-500 line-clamp-1 mt-1 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                            {track.performer || "Unknown Artist"}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Recently Played Section */}
                {recentTracks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                                    {t('recentlyPlayed') || "Recently Played"}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {t('continueListening') || "Continue your musical journey"}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            {recentTracks.map((track, index) => (
                                <motion.div
                                    key={track.id || track.index || `recent-${index}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ x: 8, backgroundColor: "#f9fafb" }}
                                    className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-all cursor-pointer group"
                                    onClick={() => handlePlayTrack(track)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={track.cover || music}
                                                    alt={track.title}
                                                    className="w-full h-full object-cover opacity-60"
                                                    onError={(e) => {
                                                        e.target.src = music
                                                    }}
                                                />
                                            </div>
                                            {contextCurrentTrack?.id === track.id && contextIsPlaying && (
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                                                />
                                            )}
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-800 text-base line-clamp-1">
                                                {track.title || "Unknown Title"}
                                            </h4>
                                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                <Headphones className="w-3.5 h-3.5" />
                                                {track.performer || "Unknown Artist"}
                                            </p>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handlePlayTrack(track)
                                        }}
                                        className="p-3 bg-gray-100 group-hover:bg-indigo-600 rounded-full transition-all duration-300"
                                    >
                                        <Play className={`w-4 h-4 group-hover:text-white transition-colors ${contextCurrentTrack?.id === track.id && contextIsPlaying
                                            ? 'text-indigo-600'
                                            : 'text-gray-600'
                                            }`} />
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Music Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10"
                >
                    {[
                        { icon: Headphones, label: t('totalTracks') || "Total Tracks", value: tracks.length },
                        { icon: Heart, label: t('likedTracks') || "Liked Tracks", value: Object.values(isLiked).filter(Boolean).length },
                        { icon: Clock, label: t('listeningTime') || "Listening Time", value: "∞ Hours" },
                        { icon: TrendingUp, label: t('weeklyTop') || "Weekly Top", value: "Top 10" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                                    <stat.icon className="w-5 h-5 text-indigo-600" />
                                </div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {stat.label}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}