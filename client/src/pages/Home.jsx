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

    // Music context'dan olish
    const { playTrack, isLiked, toggleLike } = useMusic()


    const { data: tracksSER = [], error, isLoading } = useTopTracks();
    const tracks = tracksSER.data || []
    const [filteredTracks, setFilteredTracks] = useState([])
    const [currentTrack, setCurrentTrack] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isPlayerExpanded, setIsPlayerExpanded] = useState(false)
    const [showPlayer, setShowPlayer] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeFilter, setActiveFilter] = useState("all")
    const [loadingProgress, setLoadingProgress] = useState(0)

    // Loading progress simulation
    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 90) {
                        return 90
                    }
                    return prev + 10
                })
            }, 200)
            return () => clearInterval(interval)
        } else {
            setLoadingProgress(100)
        }
    }, [isLoading])

    // Filter tracks when data changes
    useEffect(() => {
        if (tracks.length > 0) {
            let filtered = tracks.filter(track =>
                track.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                track.performer?.toLowerCase().includes(searchQuery.toLowerCase())
            )

            // Apply additional filters
            if (activeFilter === "popular") {
                filtered = filtered.slice(0, 20)
            } else if (activeFilter === "recent") {
                filtered = [...filtered].reverse()
            }

            setFilteredTracks(filtered)
        }
    }, [searchQuery, activeFilter, tracks])

    // Play track handler
    const handlePlayTrack = (track) => {
        playTrack(track, filteredTracks)  // useMusic'dan playTrack ishlatiladi
        setCurrentTrack(track)
        setIsPlaying(true)
        setShowPlayer(true)
    }

    // Error handling
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {t('errorLoading') || "Error loading tracks"}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {t('pleaseTryAgain') || "Please try again later"}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        {t('refresh') || "Refresh"}
                    </button>
                </div>
            </div>
        )
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Progress Bar */}
                <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
                    <motion.div
                        className="h-full bg-indigo-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${loadingProgress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Loading Skeleton */}
                <LoadingSkeleton />

                {/* Loading Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg text-sm text-gray-600"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        {t('loading') || "Loading..."}
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-32 md:pb-24">
            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white overflow-hidden">
                        {/* Animated Background */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, 0],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, -5, 0],
                            }}
                            transition={{
                                duration: 15,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full"
                        />

                        <div className="relative z-10">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="flex items-center gap-2 mb-3"
                            >
                                <Sparkles className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                    {t("discoverNewMusic") || "Discover New Music"}
                                </span>
                            </motion.div>
                            <h2 className="text-xl md:text-2xl font-bold mb-2">
                                {t('welcome') || "Welcome to XoltMusic"}
                            </h2>
                            <p className="text-sm md:text-base opacity-90 mb-4 max-w-lg">
                                {t('discover') || "Discover the best music and create your own playlist"}
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl font-medium text-sm hover:shadow-lg transition-all"
                            >
                                {t('getStarted') || "Get Started"}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Top Charts */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                        >
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-base md:text-lg font-semibold text-gray-800">
                                {t('topCharts') || "Top Charts"}
                            </h3>
                            <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                                {filteredTracks.length} tracks
                            </span>
                        </motion.div>
                        <motion.button
                            onClick={() => navigate('/top-tracks')}
                            whileHover={{ x: 5 }}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                        >
                            {t('viewAll') || "View All"}
                            <span>→</span>
                        </motion.button>
                    </div>

                    {/* Tracks Grid */}
                    {filteredTracks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="text-gray-400 text-6xl mb-4">🎵</div>
                            <h4 className="text-gray-600 font-medium">
                                {t('noTracksFound') || "No tracks found"}
                            </h4>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                            {filteredTracks.slice(0, 10).map((track, index) => (
                                <motion.div
                                    key={track.index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="relative aspect-square bg-gradient-to-br from-indigo-100 to-purple-100">
                                        <img
                                            src={music}
                                            alt={track.title}
                                            className="w-full h-full object-cover opacity-50"
                                        />

                                        {/* Rank Badge */}
                                        <div className="absolute top-2 left-2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            {index + 1}
                                        </div>

                                        {/* Play Button Overlay */}
                                        <motion.button
                                            onClick={() => handlePlayTrack(track)}
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                                <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-1" />
                                            </div>
                                        </motion.button>

                                        {/* Like Button - useMusic'dan isLiked va toggleLike */}
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleLike(track.index)
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                        >
                                            <Heart
                                                className={`w-3 h-3 md:w-4 md:h-4 ${isLiked[track.index]
                                                    ? 'fill-red-500 text-red-500'
                                                    : 'text-gray-600'
                                                    }`}
                                            />
                                        </motion.button>
                                    </div>

                                    <div className="p-3">
                                        <h4 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-1">
                                            {track.title}
                                        </h4>
                                        <p className="text-xs md:text-sm text-gray-500 line-clamp-1 mt-1">
                                            {track.performer}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recently Played */}
                {filteredTracks.length > 10 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-base md:text-lg font-semibold text-gray-800">
                                {t('recentlyPlayed') || "Recently Played"}
                            </h3>
                        </div>

                        <div className="space-y-2">
                            {filteredTracks.slice(10, 15).map((track, index) => (
                                <motion.div
                                    key={track.index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ x: 4 }}
                                    className="flex items-center justify-between p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => handlePlayTrack(track)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                                            <Headphones className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
                                                {track.title}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {track.performer}
                                            </p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                    >
                                        <Play className="w-4 h-4 text-gray-600" />
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}