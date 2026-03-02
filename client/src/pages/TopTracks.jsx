import { useTranslation } from "../hooks/UseLanguage"
import { motion } from "framer-motion"
import { Play, Heart, ArrowLeft } from "lucide-react"
import { useMusic } from "../context/MusicContext"
import music from "../assets/music_def.webp"
import { Link } from "react-router-dom"
import useSWR from 'swr'
import Fetch from '../hooks/fetcher'
import { useTopTracks } from "../hooks/TopTrack"


export const TopTracks = () => {
    const { t } = useTranslation()
    const { playTrack, isLiked, toggleLike } = useMusic()
   const { data: tracks = [], error, isLoading } = useTopTracks();

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            to="/"
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {t('top50') || "Top 50 Tracks"}
                        </h1>
                    </div>
                    <div className="text-center py-10 text-red-500">
                        {t('error') || "Something went wrong. Please check your network connection and try refreshing the page."}
                    </div>
                </div>
            </div>
        )
    }

    // Loading holatini ko'rsatish
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                                <div className="aspect-square bg-gray-200" />
                                <div className="p-3">
                                    <div className="h-4 bg-gray-200 rounded mb-2" />
                                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        to="/"
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {t('top50') || "Top 50 Tracks"}
                    </h1>
                </div>

                {/* Tracks Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {tracks?.data?.map((track, index) => (
                        <motion.div
                            key={track.index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                        >
                            <div className="relative aspect-square bg-gradient-to-br from-indigo-100 to-purple-100">
                                <img
                                    src={music}
                                    alt={track.title}
                                    className="w-full h-full object-cover opacity-50"
                                />

                                {/* Rank Badge */}
                                <div className="absolute top-2 left-2 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </div>

                                {/* Play Button */}
                                <motion.button
                                    onClick={() => playTrack(track, tracks)}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                        <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-1" />
                                    </div>
                                </motion.button>

                                {/* Like Button */}
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
            </div>
        </div>
    )
}