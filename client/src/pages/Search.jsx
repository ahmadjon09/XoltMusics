import { useTranslation } from "../hooks/UseLanguage"
import music from "../assets/music_def.webp"
import { motion, AnimatePresence } from "framer-motion"
import {
    Play,
    Heart,
    Search,
    X,
    Loader2
} from "lucide-react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useMusic } from "../context/MusicContext"
import { useSearchTracks } from "../hooks/Search"
import { useSearchParams, useNavigate } from "react-router-dom"

export const SearchPage = () => {
    const { t } = useTranslation()
    const { playTrack, isLiked, toggleLike } = useMusic()
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    // Get query from URL
    const urlQuery = searchParams.get('q') || ""

    // States
    const [searchQuery, setSearchQuery] = useState(urlQuery)
    const [recentSearches, setRecentSearches] = useState([])
    const [debouncedQuery, setDebouncedQuery] = useState(urlQuery)

    // Update URL when search query changes
    useEffect(() => {
        if (searchQuery) {
            // Update URL params without reload
            setSearchParams({ q: searchQuery }, { replace: true })
        } else {
            // Remove q param if search is empty
            setSearchParams({}, { replace: true })
        }
    }, [searchQuery, setSearchParams])

    // Initialize search from URL on mount
    useEffect(() => {
        if (urlQuery && urlQuery.length >= 2) {
            setDebouncedQuery(urlQuery)
            // Save to recent searches if coming from URL
            saveRecentSearch(urlQuery)
        }
    }, []) // Only on mount

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 2 || searchQuery.length === 0) {
                setDebouncedQuery(searchQuery)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery])

    // Search hook'idan ma'lumotlarni olish
    const { data: searchResultsSER, isLoading, error } = useSearchTracks(debouncedQuery)

    // Faqat song'larni filter qilish
    const searchResults = useMemo(() => {
        const results = searchResultsSER?.data || []
        return results
    }, [searchResultsSER?.data])

    // Save recent searches
    const saveRecentSearch = useCallback((query) => {
        if (!query?.trim() || query.length < 2) return
        setRecentSearches(prev => {
            const filtered = prev.filter(item => item !== query)
            return [query, ...filtered].slice(0, 5)
        })
    }, [])

    // Handle search submit
    const handleSearch = useCallback((e) => {
        e?.preventDefault()
        if (searchQuery?.trim()?.length >= 2) {
            saveRecentSearch(searchQuery)
        }
    }, [searchQuery, saveRecentSearch])

    // Handle search from recent
    const handleRecentSearch = useCallback((query) => {
        setSearchQuery(query)
        setDebouncedQuery(query)
        saveRecentSearch(query)
    }, [saveRecentSearch])

    // Clear search
    const clearSearch = useCallback(() => {
        setSearchQuery("")
        setDebouncedQuery("")
    }, [])

    // Remove from recent
    const removeRecent = useCallback((queryToRemove) => {
        setRecentSearches(prev => prev.filter(item => item !== queryToRemove))
    }, [])

    // Play track handler
    const handlePlayTrack = useCallback((track) => {
        if (track) {
            playTrack(track, searchResults)
        }
    }, [playTrack, searchResults])

    // Share search URL
    const shareSearch = useCallback(() => {
        const url = `${window.location.origin}/search?q=${encodeURIComponent(searchQuery)}`
        navigator.clipboard?.writeText(url)
        // You can add a toast notification here
    }, [searchQuery])

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-24">
            <div className="container mx-auto px-4">
                {/* Search Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {t('search') || "Search Songs"}
                        </h1>

                        {/* Share button (only when searching) */}
                        {searchQuery && (
                            <button
                                onClick={shareSearch}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                title={t('shareSearch') || "Share search"}
                            >
                                <svg
                                    className="w-5 h-5 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="relative">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('searchPlaceholder') || "Search for songs..."}
                                className="w-full pl-12 pr-24 py-4 bg-white rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all outline-none text-gray-700"
                                autoFocus
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        aria-label="Clear search"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                )}
                                {/* URL Indicator */}
                                {searchQuery && (
                                    <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-500">
                                        <span className="text-gray-400">?q=</span>
                                        <span className="max-w-[100px] truncate">{searchQuery}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* URL Preview (for mobile) */}
                    {searchQuery && (
                        <div className="mt-2 md:hidden flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-xs text-gray-500">
                            <span className="text-gray-400">{window.location.origin}/search?q=</span>
                            <span className="font-mono truncate">{searchQuery}</span>
                        </div>
                    )}
                </div>

                {/* Recent Searches */}
                {!searchQuery && recentSearches.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">
                                {t('recentSearches') || "Recent Searches"}
                            </h3>
                            <button
                                onClick={() => setRecentSearches([])}
                                className="text-xs text-indigo-600 hover:text-indigo-700"
                            >
                                {t('clearAll') || "Clear All"}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map((query, index) => (
                                <motion.div
                                    key={`recent-${query}-${index}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group flex items-center gap-1 bg-white border border-gray-200 rounded-full pl-3 pr-1 py-1 hover:border-indigo-300 transition-colors"
                                >
                                    <button
                                        onClick={() => handleRecentSearch(query)}
                                        className="text-sm text-gray-700 hover:text-indigo-600"
                                    >
                                        {query}
                                    </button>
                                    <button
                                        onClick={() => removeRecent(query)}
                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        aria-label="Remove from recent"
                                    >
                                        <X className="w-3 h-3 text-gray-400" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Search Results */}
                {searchQuery && (
                    <div className="mb-8">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                                        {t('searching') || "Searching..."}
                                    </span>
                                ) : (
                                    <>
                                        {t('searchResults') || "Search Results"}
                                        <span className="ml-2 text-sm font-normal text-gray-500">
                                            ({searchResults?.length} {t('songs') || "songs"})
                                        </span>
                                    </>
                                )}
                            </h3>

                            {/* Current search indicator */}
                            {!isLoading && searchResults.length > 0 && (
                                <div className="text-xs text-gray-400">
                                    {t('searchingFor') || "Searching for"}: "{debouncedQuery}"
                                </div>
                            )}
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">😕</div>
                                <h4 className="text-gray-600 font-medium mb-2">
                                    {t('searchError') || "Error searching songs"}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {t('pleaseTryAgain') || "Please try again"}
                                </p>
                            </div>
                        )}

                        {/* Loading Skeletons */}
                        {isLoading && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                                {[...Array(10)].map((_, i) => (
                                    <div key={`skeleton-${i}`} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                                        <div className="aspect-square bg-gray-200" />
                                        <div className="p-3">
                                            <div className="h-4 bg-gray-200 rounded mb-2" />
                                            <div className="h-3 bg-gray-200 rounded w-2/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* No Results */}
                        {!isLoading && searchResults.length === 0 && debouncedQuery.length >= 2 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <div className="text-6xl mb-4">🔍</div>
                                <h4 className="text-gray-700 font-medium text-lg mb-2">
                                    {t('noSongsFound') || "No songs found"}
                                </h4>
                                <p className="text-gray-500 text-sm">
                                    {t('tryDifferentKeywords') || "Try different keywords"}
                                </p>
                                <button
                                    onClick={clearSearch}
                                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition-colors"
                                >
                                    {t('clearSearch') || "Clear Search"}
                                </button>
                            </motion.div>
                        )}

                        {/* Results Grid - Faqat Songs */}
                        {!isLoading && searchResults.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                                {searchResults.map((track, index) => (
                                    <motion.div
                                        key={`song-${track?.index || index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ y: -4 }}
                                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                                    >
                                        <div className="relative aspect-square bg-gradient-to-br from-indigo-100 to-purple-100">
                                            <img
                                                src={track?.image || music}
                                                alt={track?.title || "Track"}
                                                className="w-full h-full object-cover opacity-50"
                                                loading="lazy"
                                            />

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

                                            {/* Like Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (track?.index) {
                                                        toggleLike(track.index)
                                                    }
                                                }}
                                                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                            >
                                                <Heart
                                                    className={`w-3 h-3 md:w-4 md:h-4 ${track?.index && isLiked[track.index]
                                                        ? 'fill-red-500 text-red-500'
                                                        : 'text-gray-600'
                                                        }`}
                                                />
                                            </motion.button>
                                        </div>

                                        <div className="p-3">
                                            <h4 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-1">
                                                {track?.title || "Unknown Title"}
                                            </h4>
                                            <p className="text-xs md:text-sm text-gray-500 line-clamp-1 mt-1">
                                                {track?.performer || "Unknown Artist"}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}