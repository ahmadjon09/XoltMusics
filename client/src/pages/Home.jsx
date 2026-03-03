import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import {
    Play,
    Heart,
    Clock,
    TrendingUp,
    Sparkles,
    Pause,
    SkipForward,
    SkipBack,
    Volume2,
    VolumeX,
    Repeat,
    Shuffle,
    Music,
    User,
    Calendar,
    Disc3,
    ListMusic,
    Share2,
    X,
    Maximize2,
    ChevronDown,
    Search,
    Users,
    Menu,
    Home,
    Settings,
    ChevronRight,
    Instagram,
    Facebook,
    Twitter,
    MessageCircle,
    Copy,
    Check,
    ArrowLeft,
    Headphones,
    PlusCircle,
    Volume1,
    Repeat1,
    Grid3x3,
    LayoutList,
    HeartPulse,
    CalendarDays,
    AlertCircle,
    Loader2,
    AudioLines,
    Info,
    Moon,
    Sun,
    Trash2,
    VolumeIcon as VolumeIcon2,
    RepeatIcon as RepeatIcon2,
    ShuffleIcon as ShuffleIcon2,
    HeartIcon as HeartIcon2,
    Monitor,
} from "lucide-react"

// ==================== AUDIUS API CONFIG ====================
const BASE_URL = 'https://discoveryprovider.audius.co/v1'

const fetcher = async (url) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
}

// ==================== UTILITY FUNCTIONS ====================
const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')} `
}

const formatNumber = (num) => {
    if (!num && num !== 0) return '0'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
}

const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getArtworkUrl = (artwork, size = '480x480') => {
    if (!artwork) return null
    return artwork[size] || artwork['150x150'] || artwork['1000x1000'] || null
}

// ==================== STORAGE KEYS ====================
const STORAGE_KEYS = {
    VOLUME: 'xoltmusic_volume',
    MUTED: 'xoltmusic_muted',
    REPEAT_MODE: 'xoltmusic_repeat',
    SHUFFLE: 'xoltmusic_shuffle',
    LIKED_TRACKS: 'xoltmusic_liked',
    PLAYLISTS: 'xoltmusic_playlists',
    VIEW_MODE: 'xoltmusic_viewmode',
    DARK_MODE: 'xoltmusic_darkmode',
    QUEUE: 'xoltmusic_queue',
    CURRENT_TRACK: 'xoltmusic_current',
    RECENT_SEARCHES: 'xoltmusic_recent'
}

// ==================== TIME PERIODS ====================
const timePeriods = [
    { value: 'week', label: 'This Week', icon: CalendarDays },
    { value: 'month', label: 'This Month', icon: Calendar },
]

// ==================== THEME CONTEXT ====================
const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE)
        return saved ? JSON.parse(saved) : false
    })

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode))
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

    return { darkMode, setDarkMode }
}

// ==================== MAIN COMPONENT ====================
export const AudiusPlayer = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()
    const artistHandle = params.artistHandle
    const trackId = params.trackId

    // Theme
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE)
        return saved ? JSON.parse(saved) : false
    })

    // ==================== STATE ====================
    const [timePeriod, setTimePeriod] = useState('week')
    const [searchQuery, setSearchQuery] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [activeTab, setActiveTab] = useState('trending')
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [currentView, setCurrentView] = useState('home')
    const [copied, setCopied] = useState(false)
    const [isGridView, setIsGridView] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE)
        return saved ? JSON.parse(saved) : true
    })
    const [showPlaylists, setShowPlaylists] = useState(false)
    const [playlists, setPlaylists] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.PLAYLISTS)
        return saved ? JSON.parse(saved) : []
    })
    const [selectedPlaylist, setSelectedPlaylist] = useState(null)
    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES)
        return saved ? JSON.parse(saved) : []
    })
    const [showAbout, setShowAbout] = useState(false)
    const [selectedTrackForInfo, setSelectedTrackForInfo] = useState(null)
    const [history, setHistory] = useState([])
    const [showSettings, setShowSettings] = useState(false)

    // Player State
    const [currentTrack, setCurrentTrack] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_TRACK)
        return saved ? JSON.parse(saved) : null
    })
    const [queue, setQueue] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.QUEUE)
        return saved ? JSON.parse(saved) : []
    })
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.VOLUME)
        return saved ? parseFloat(saved) : 1
    })
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.MUTED)
        return saved ? JSON.parse(saved) : false
    })
    const [repeatMode, setRepeatMode] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.REPEAT_MODE)
        return saved || 'none'
    })
    const [isShuffling, setIsShuffling] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.SHUFFLE)
        return saved ? JSON.parse(saved) : false
    })
    const [likedTracks, setLikedTracks] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.LIKED_TRACKS)
        return saved ? JSON.parse(saved) : {}
    })
    const [showFullPlayer, setShowFullPlayer] = useState(false)
    const [showShareModal, setShowShareModal] = useState(false)
    const [selectedTrack, setSelectedTrack] = useState(null)
    const [selectedArtist, setSelectedArtist] = useState(null)
    const [showQueue, setShowQueue] = useState(false)
    const [showTrackInfo, setShowTrackInfo] = useState(false)

    // Refs
    const audioRef = useRef(null)
    const observerRef = useRef()
    const touchStartX = useRef(0)
    const touchEndX = useRef(0)

    // ==================== DATA FETCHING ====================
    const { data: trendingData, error: trendingError, isLoading: trendingLoading } = useSWR(
        `${BASE_URL}/tracks/trending?time=${timePeriod}&limit=50`,
        fetcher
    )
    const trendingTracks = trendingData?.data || []

    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data?.length) return null
        if (pageIndex === 0) return `${BASE_URL}/tracks/trending?time=${timePeriod}&limit=20`
        return `${BASE_URL}/tracks/trending?time=${timePeriod}&limit=20&offset=${pageIndex * 20}`
    }
    const { data: infiniteData, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher)
    const isLoadingMore = isValidating
    const isReachingEnd = infiniteData && infiniteData[infiniteData.length - 1]?.data?.length < 20

    const { data: searchData } = useSWR(
        searchQuery ? `${BASE_URL}/tracks/search?query=${encodeURIComponent(searchQuery)}&limit=30` : null,
        fetcher
    )
    const searchResults = searchData?.data || []

    const { data: usersData } = useSWR(
        searchQuery ? `${BASE_URL}/users/search?query=${encodeURIComponent(searchQuery)}&limit=10` : null,
        fetcher
    )
    const searchUsers = usersData?.data || []

    const { data: artistData } = useSWR(
        artistHandle ? `${BASE_URL}/users/handle/${artistHandle}` : null,
        fetcher
    )
    const artist = artistData?.data

    const { data: artistTracksData } = useSWR(
        artist?.id ? `${BASE_URL}/users/${artist.id}/tracks?limit=50` : null,
        fetcher
    )
    const artistTracks = artistTracksData?.data || []

    const { data: trackData } = useSWR(
        trackId ? `${BASE_URL}/tracks/${trackId}` : null,
        fetcher
    )
    const trackDetail = trackData?.data

    const { data: playlistsData } = useSWR(
        `${BASE_URL}/playlists/featured?limit=20`,
        fetcher
    )
    const featuredPlaylists = playlistsData?.data || []

    // ==================== PERSISTENCE ====================
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString())
    }, [volume])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.MUTED, JSON.stringify(isMuted))
    }, [isMuted])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.REPEAT_MODE, repeatMode)
    }, [repeatMode])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.SHUFFLE, JSON.stringify(isShuffling))
    }, [isShuffling])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.LIKED_TRACKS, JSON.stringify(likedTracks))
    }, [likedTracks])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists))
    }, [playlists])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.VIEW_MODE, JSON.stringify(isGridView))
    }, [isGridView])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode))
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

    useEffect(() => {
        if (currentTrack) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_TRACK, JSON.stringify(currentTrack))
        }
    }, [currentTrack])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue))
    }, [queue])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(recentSearches.slice(0, 10)))
    }, [recentSearches])

    // ==================== NAVIGATION ====================
    useEffect(() => {
        if (artistHandle && artist) {
            setCurrentView('artist')
            setSelectedArtist(artist)
            addToHistory({ type: 'artist', id: artist.id, name: artist.name, handle: artist.handle })
        } else if (trackId && trackDetail) {
            setCurrentView('track')
            setSelectedTrack(trackDetail)
            addToHistory({ type: 'track', id: trackDetail.id, title: trackDetail.title, artist: trackDetail.user?.name })
        } else {
            setCurrentView('home')
        }
    }, [artistHandle, trackId, artist, trackDetail])

    const addToHistory = (item) => {
        setHistory(prev => {
            const newHistory = [item, ...prev.filter(h => h.id !== item.id)].slice(0, 20)
            return newHistory
        })
    }

    const goBack = () => {
        if (showMobileMenu) {
            setShowMobileMenu(false)
        } else if (showSearch) {
            setShowSearch(false)
            setSearchQuery('')
        } else if (showFullPlayer) {
            setShowFullPlayer(false)
        } else if (showPlaylists) {
            setShowPlaylists(false)
        } else if (showQueue) {
            setShowQueue(false)
        } else if (showShareModal) {
            setShowShareModal(false)
        } else if (showAbout) {
            setShowAbout(false)
        } else if (showSettings) {
            setShowSettings(false)
        } else if (currentView !== 'home') {
            navigate('/')
        } else {
            // On home, maybe close search or menu
            if (showSearch) {
                setShowSearch(false)
            } else {
                // Exit app or minimize
                if (window.history.length > 1) {
                    navigate(-1)
                }
            }
        }
    }

    // Handle back button
    useEffect(() => {
        const handlePopState = (e) => {
            e.preventDefault()
            goBack()
        }
        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [showMobileMenu, showSearch, showFullPlayer, showPlaylists, showQueue, showShareModal, showAbout, showSettings, currentView])

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                goBack()
            }
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [])

    // ==================== AUDIO EFFECTS ====================
    useEffect(() => {
        if (audioRef.current && currentTrack) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log('Playback failed:', e))
            } else {
                audioRef.current.pause()
            }
        }
    }, [isPlaying, currentTrack])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateProgress = () => setProgress(audio.currentTime)
        const updateDuration = () => setDuration(audio.duration)
        const handleEnded = () => {
            if (repeatMode === 'one') {
                audio.currentTime = 0
                audio.play()
            } else if (repeatMode === 'all' || isShuffling) {
                playNextTrack()
            } else {
                setIsPlaying(false)
                setProgress(0)
            }
        }

        audio.addEventListener('timeupdate', updateProgress)
        audio.addEventListener('loadedmetadata', updateDuration)
        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.removeEventListener('timeupdate', updateProgress)
            audio.removeEventListener('loadedmetadata', updateDuration)
            audio.removeEventListener('ended', handleEnded)
        }
    }, [repeatMode, isShuffling])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume
        }
    }, [volume, isMuted])

    // ==================== TOUCH GESTURES ====================
    useEffect(() => {
        const handleTouchStart = (e) => {
            touchStartX.current = e.touches[0].clientX
        }

        const handleTouchEnd = () => {
            const difference = touchStartX.current - touchEndX.current
            if (Math.abs(difference) > 100) {
                if (difference > 0) {
                    playNextTrack()
                } else {
                    playPreviousTrack()
                }
            }
        }

        const handleTouchMove = (e) => {
            touchEndX.current = e.touches[0].clientX
        }

        if (showFullPlayer) {
            document.addEventListener('touchstart', handleTouchStart)
            document.addEventListener('touchend', handleTouchEnd)
            document.addEventListener('touchmove', handleTouchMove)
        }

        return () => {
            document.removeEventListener('touchstart', handleTouchStart)
            document.removeEventListener('touchend', handleTouchEnd)
            document.removeEventListener('touchmove', handleTouchMove)
        }
    }, [showFullPlayer])

    // ==================== INFINITE SCROLL ====================
    const lastTrackRef = useCallback((node) => {
        if (isLoadingMore) return
        if (observerRef.current) observerRef.current.disconnect()

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isReachingEnd) {
                setSize(size + 1)
            }
        })

        if (node) observerRef.current.observe(node)
    }, [isLoadingMore, isReachingEnd, setSize, size])

    // ==================== PLAYER FUNCTIONS ====================
    const playTrack = (track, trackQueue = null, shouldPlay = true) => {
        const artworkUrl = getArtworkUrl(track.artwork, '1000x1000')
        const trackToPlay = {
            id: track.id,
            title: track.title,
            performer: track.user?.name || 'Unknown Artist',
            cover: artworkUrl || `https://via.placeholder.com/1000x1000/6366f1/ffffff?text=${encodeURIComponent(track.title?.[0] || 'M')}`,
            duration: track.duration,
            genre: track.genre,
            mood: track.mood,
            releaseDate: track.release_date,
            playCount: track.play_count,
            favoriteCount: track.favorite_count,
            repostCount: track.repost_count,
            artwork: track.artwork,
            user: track.user,
            stream_url: `${BASE_URL}/tracks/${track.id}/stream`
        }

        setCurrentTrack(trackToPlay)
        setQueue(trackQueue || [])
        if (shouldPlay) {
            setIsPlaying(true)
        }
        setProgress(0)
    }

    const togglePlay = () => {
        if (currentTrack) {
            setIsPlaying(!isPlaying)
        }
    }

    const pauseTrack = () => setIsPlaying(false)
    const resumeTrack = () => setIsPlaying(true)

    const playNextTrack = () => {
        if (!currentTrack || queue.length === 0) return

        const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
        let nextIndex

        if (isShuffling) {
            nextIndex = Math.floor(Math.random() * queue.length)
        } else {
            nextIndex = currentIndex + 1
            if (nextIndex >= queue.length) {
                if (repeatMode === 'all') {
                    nextIndex = 0
                } else {
                    return
                }
            }
        }

        if (nextIndex >= 0 && nextIndex < queue.length) {
            playTrack(queue[nextIndex], queue)
        }
    }

    const playPreviousTrack = () => {
        if (!currentTrack || queue.length === 0) return

        const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
        let prevIndex = currentIndex - 1

        if (prevIndex < 0) {
            if (repeatMode === 'all') {
                prevIndex = queue.length - 1
            } else {
                return
            }
        }

        if (prevIndex >= 0) {
            playTrack(queue[prevIndex], queue)
        }
    }

    const seekTo = (value) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value
            setProgress(value)
        }
    }

    const toggleLike = (trackId) => {
        setLikedTracks(prev => ({
            ...prev,
            [trackId]: !prev[trackId]
        }))
    }

    // ==================== PLAYLIST FUNCTIONS ====================
    const createPlaylist = (name) => {
        const newPlaylist = {
            id: Date.now().toString(),
            name,
            tracks: [],
            createdAt: new Date().toISOString(),
            description: ''
        }
        setPlaylists([...playlists, newPlaylist])
    }

    const addTrackToPlaylist = (playlistId, track) => {
        setPlaylists(playlists.map(p =>
            p.id === playlistId
                ? { ...p, tracks: [...p.tracks, track] }
                : p
        ))
    }

    const removePlaylist = (playlistId) => {
        setPlaylists(playlists.filter(p => p.id !== playlistId))
    }

    const removeTrackFromPlaylist = (playlistId, trackId) => {
        setPlaylists(playlists.map(p =>
            p.id === playlistId
                ? { ...p, tracks: p.tracks.filter(t => t.id !== trackId) }
                : p
        ))
    }

    const updatePlaylist = (playlistId, updates) => {
        setPlaylists(playlists.map(p =>
            p.id === playlistId
                ? { ...p, ...updates }
                : p
        ))
    }

    // ==================== SEARCH FUNCTIONS ====================
    const handleSearch = (query) => {
        setSearchQuery(query)
        if (query && !recentSearches.includes(query)) {
            setRecentSearches(prev => [query, ...prev].slice(0, 10))
        }
        setActiveTab('search')
    }

    const clearRecentSearches = () => {
        setRecentSearches([])
    }

    // ==================== NAVIGATION ====================
    const goToArtist = (handle) => {
        navigate(`/artist/${handle}`)
        setCurrentView('artist')
        setShowMobileMenu(false)
        setShowSearch(false)
    }

    const goToTrack = (id, openInfo = false) => {
        navigate(`/track/${id}`)
        setCurrentView('track')
        setShowMobileMenu(false)
        setShowSearch(false)
        if (openInfo) {
            setShowTrackInfo(true)
        }
    }

    const goHome = () => {
        navigate('/')
        setCurrentView('home')
        setShowMobileMenu(false)
        setShowSearch(false)
        setSearchQuery('')
    }

    // ==================== MODAL FUNCTIONS ====================
    const openTrackDetails = (track, openInfo = false) => {
        setSelectedTrack(track)
        if (openInfo) {
            setSelectedTrackForInfo(track)
            setShowTrackInfo(true)
        } else {
            goToTrack(track.id)
        }
    }

    const openShareModal = (track) => {
        setSelectedTrack(track)
        setShowShareModal(true)
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/track/${selectedTrack?.id}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    // ==================== RENDER FUNCTIONS ====================
    const renderTrackCard = (track, index, showRank = false) => {
        const artworkUrl = getArtworkUrl(track.artwork, '480x480')
        const isCurrentTrack = currentTrack?.id === track.id

        return (
            <div
                key={track.id}
                className={`group relative rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                    <img
                        src={artworkUrl || `https://via.placeholder.com/480x480/6366f1/ffffff?text=${encodeURIComponent(track.title?.[0] || 'M')}`}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onClick={() => openTrackDetails(track, false)}
                    />

                    {showRank && index < 10 && (
                        <div className="absolute top-3 left-3 w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-10">
                            {index + 1}
                        </div>
                    )}

                    {track.play_count > 0 && (
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
                            <Headphones className="w-3 h-3" />
                            {formatNumber(track.play_count)}
                        </div>
                    )}

                    {/* Play button overlay */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            playTrack(track, trendingTracks)
                        }}
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300"
                    >
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 transition-all duration-300">
                            {isCurrentTrack && isPlaying ? (
                                <Pause className="w-6 h-6 md:w-7 md:h-7 text-white" />
                            ) : (
                                <Play className="w-6 h-6 md:w-7 md:h-7 text-white ml-1" />
                            )}
                        </div>
                    </button>

                    {/* Like button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            toggleLike(track.id)
                        }}
                        className="absolute bottom-3 right-3 p-2 bg-white/95 dark:bg-gray-800/95 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl z-10"
                    >
                        <Heart
                            className={`w-4 h-4 transition-colors ${likedTracks[track.id]
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-600 dark:text-gray-300'
                                }`}
                        />
                    </button>

                    {/* Info button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            openTrackDetails(track, true)
                        }}
                        className="absolute bottom-3 left-3 p-2 bg-white/95 dark:bg-gray-800/95 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl z-10"
                    >
                        <Info className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>

                    {isCurrentTrack && isPlaying && (
                        <div className="absolute bottom-3 left-14 flex gap-1 z-10">
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse delay-75" />
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse delay-150" />
                        </div>
                    )}
                </div>

                <div className="p-3" onClick={() => openTrackDetails(track, false)}>
                    <h3 className={`font-semibold text-sm md:text-base line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {track.title || "Unknown Title"}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1 flex items-center gap-1">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{track.user?.name || "Unknown Artist"}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 dark:text-gray-500">
                        {track.duration > 0 && (
                            <span className="flex items-center gap-1 flex-shrink-0">
                                <Clock className="w-3 h-3" />
                                {formatDuration(track.duration)}
                            </span>
                        )}
                        {track.genre && (
                            <>
                                <span className="flex-shrink-0">•</span>
                                <span className="truncate">{track.genre}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    const renderTrackListItem = (track, index) => {
        const artworkUrl = getArtworkUrl(track.artwork, '150x150')
        const isCurrentTrack = currentTrack?.id === track.id

        return (
            <div
                key={track.id}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isCurrentTrack
                    ? darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'
                    : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                    }`}
                onClick={() => openTrackDetails(track, false)}
            >
                <span className={`text-sm w-6 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{index + 1}</span>
                <img
                    src={artworkUrl || `https://via.placeholder.com/150x150/6366f1/ffffff?text=${encodeURIComponent(track.title?.[0] || 'M')}`}
                    alt={track.title}
                    className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{track.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{track.user?.name}</p>
                </div>
                {isCurrentTrack && isPlaying && (
                    <div className="flex gap-0.5">
                        <div className="w-1 h-1 bg-indigo-600 rounded-full animate-pulse" />
                        <div className="w-1 h-1 bg-indigo-600 rounded-full animate-pulse delay-75" />
                        <div className="w-1 h-1 bg-indigo-600 rounded-full animate-pulse delay-150" />
                    </div>
                )}
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{formatDuration(track.duration)}</span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            toggleLike(track.id)
                        }}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                    >
                        <Heart className={`w-4 h-4 ${likedTracks[track.id] ? 'fill-red-500 text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            openTrackDetails(track, true)
                        }}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                    >
                        <Info className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    </button>
                </div>
            </div>
        )
    }

    const renderArtistCard = (artist) => {
        const profilePic = getArtworkUrl(artist.profile_picture, '150x150')

        return (
            <div
                key={artist.id}
                className={`rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                onClick={() => goToArtist(artist.handle)}
            >
                <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                        <img
                            src={profilePic || `https://via.placeholder.com/150x150/8b5cf6/ffffff?text=${encodeURIComponent(artist.name?.[0] || 'A')}`}
                            alt={artist.name}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{artist.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">@{artist.handle}</p>
                        {artist.bio && (
                            <p className={`text-xs mt-1 line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{artist.bio}</p>
                        )}
                        <div className={`flex items-center gap-3 mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {formatNumber(artist.follower_count)}
                            </span>
                            <span>•</span>
                            <span>{artist.track_count || 0} tracks</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderPlaylistCard = (playlist) => {
        const artworkUrl = getArtworkUrl(playlist.artwork, '480x480')

        return (
            <div
                key={playlist.id}
                className={`group rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                onClick={() => {
                    setSelectedPlaylist(playlist)
                    setShowPlaylists(true)
                }}
            >
                <div className="relative aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900">
                    <img
                        src={artworkUrl || `https://via.placeholder.com/480x480/8b5cf6/ffffff?text=${encodeURIComponent(playlist.playlist_name?.[0] || 'P')}`}
                        alt={playlist.playlist_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
                        <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                </div>
                <div className="p-3">
                    <h3 className={`font-semibold text-sm line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{playlist.playlist_name}</h3>
                    <p className={`text-xs line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{playlist.description || 'No description'}</p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{playlist.track_count || 0} tracks</p>
                </div>
            </div>
        )
    }

    // ==================== LOADING & ERROR ====================
    if (trendingError) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Unable to load tracks</h2>
                    <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{trendingError.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    // ==================== RENDER VIEWS ====================
    const renderHomeView = () => (
        <>
            {/* Hero Section */}
            {!showSearch && (
                <div className="mb-8">
                    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 md:p-10 text-white overflow-hidden">
                        <div className="absolute -right-20 -top-20 w-60 h-60 bg-white/10 rounded-full animate-pulse" />
                        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-white/10 rounded-full animate-pulse delay-1000" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                                <span className="text-xs md:text-sm font-medium tracking-wide uppercase">Discover Your Next Favorite Track</span>
                            </div>

                            <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">Welcome to XoltMusic</h1>
                            <p className="text-sm md:text-lg opacity-90 mb-4 md:mb-6 max-w-2xl">
                                Immerse yourself in a world of unlimited music. Create your perfect playlist and enjoy millions of tracks.
                            </p>

                            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                                <button
                                    onClick={() => setShowSearch(true)}
                                    className="px-6 md:px-8 py-2.5 md:py-3.5 bg-white text-indigo-600 rounded-xl font-semibold shadow-xl flex items-center gap-2 text-sm md:text-base"
                                >
                                    <span>Start Listening</span>
                                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                                </button>

                                <div className="flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-xl">
                                    <Music className="w-3 h-3 md:w-4 md:h-4" />
                                    <span className="text-xs md:text-sm">1M+ Tracks</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Featured Playlists */}
            {featuredPlaylists.length > 0 && (
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
                                <ListMusic className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className={`text-lg md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Featured Playlists</h2>
                                <p className={`text-xs md:text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Curated just for you</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPlaylists(true)}
                            className="text-sm text-indigo-600 font-medium flex items-center gap-1"
                        >
                            See All
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {featuredPlaylists.slice(0, 6).map(playlist => renderPlaylistCard(playlist))}
                    </div>
                </div>
            )}

            {/* Tracks Section */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className={`text-lg md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Trending on Audius</h2>
                            <p className={`text-xs md:text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Most popular tracks this {timePeriod}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsGridView(true)}
                            className={`p-2 rounded-lg transition-colors ${isGridView
                                ? darkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                                : darkMode ? 'text-gray-600' : 'text-gray-400'
                                }`}
                        >
                            <Grid3x3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsGridView(false)}
                            className={`p-2 rounded-lg transition-colors ${!isGridView
                                ? darkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                                : darkMode ? 'text-gray-600' : 'text-gray-400'
                                }`}
                        >
                            <LayoutList className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {trendingTracks.length === 0 ? (
                    <div className={`text-center py-16 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <Music className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                        <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>No tracks available</h3>
                    </div>
                ) : (
                    <>
                        {isGridView ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
                                {trendingTracks.map((track, index) => renderTrackCard(track, index, true))}
                            </div>
                        ) : (
                            <div className={`rounded-2xl shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                {trendingTracks.map((track, index) => renderTrackListItem(track, index))}
                            </div>
                        )}
                    </>
                )}

                {/* Infinite Scroll */}
                {!isReachingEnd && trendingTracks.length > 0 && (
                    <div ref={lastTrackRef} className="flex justify-center py-8">
                        {isLoadingMore ? (
                            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Loading more...</span>
                            </div>
                        ) : (
                            <button
                                onClick={() => setSize(size + 1)}
                                className={`px-6 py-3 rounded-xl font-medium shadow-sm border transition-shadow ${darkMode
                                    ? 'bg-gray-800 text-indigo-400 border-gray-700 hover:shadow-md'
                                    : 'bg-white text-indigo-600 border-gray-200 hover:shadow-md'
                                    }`}
                            >
                                Load More
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    )

    const renderSearchView = () => (
        <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && !searchQuery && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={`text-lg md:text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            <Search className="w-5 h-5 text-indigo-600" />
                            Recent Searches
                        </h2>
                        <button
                            onClick={clearRecentSearches}
                            className="text-sm text-red-500 hover:text-red-600"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {recentSearches.map((query, index) => (
                            <button
                                key={index}
                                onClick={() => handleSearch(query)}
                                className={`px-4 py-2 rounded-full text-sm ${darkMode
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {query}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Users Results */}
            {searchUsers.length > 0 && (
                <div className="mb-8">
                    <h2 className={`text-lg md:text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        <Users className="w-5 h-5 text-indigo-600" />
                        Artists
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {searchUsers.map((user) => renderArtistCard(user))}
                    </div>
                </div>
            )}

            {/* Tracks Results */}
            {searchResults.length > 0 && (
                <div className="mb-8">
                    <h2 className={`text-lg md:text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        <Music className="w-5 h-5 text-indigo-600" />
                        Tracks
                    </h2>
                    {isGridView ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
                            {searchResults.map((track, index) => renderTrackCard(track, index, false))}
                        </div>
                    ) : (
                        <div className={`rounded-2xl shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            {searchResults.map((track, index) => renderTrackListItem(track, index))}
                        </div>
                    )}
                </div>
            )}

            {/* No Results */}
            {searchUsers.length === 0 && searchResults.length === 0 && searchQuery && (
                <div className={`text-center py-16 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <Search className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>No results found</h3>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Try a different search term</p>
                </div>
            )}
        </>
    )

    const renderArtistView = () => {
        if (!artist) return null

        return (
            <div className="mb-8">
                {/* Artist Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 text-white mb-8">
                    <button onClick={goBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <img
                            src={getArtworkUrl(artist.profile_picture, '480x480') || `https://via.placeholder.com/480x480/8b5cf6/ffffff?text=${encodeURIComponent(artist.name?.[0] || 'A')}`}
                            alt={artist.name}
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/20"
                        />
                        <div className="text-center md:text-left">
                            <h1 className="text-xl md:text-4xl font-bold mb-2">{artist.name}</h1>
                            <p className="text-white/80 mb-2">@{artist.handle}</p>
                            {artist.bio && <p className="text-white/70 text-sm max-w-2xl line-clamp-2">{artist.bio}</p>}
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                                <span className="flex items-center gap-1 text-sm">
                                    <Users className="w-4 h-4" />
                                    {formatNumber(artist.follower_count)} followers
                                </span>
                                <span>•</span>
                                <span className="text-sm">{artist.track_count || 0} tracks</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Artist Tracks */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Tracks by {artist.name}</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsGridView(true)}
                            className={`p-2 rounded-lg transition-colors ${isGridView
                                ? darkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                                : darkMode ? 'text-gray-600' : 'text-gray-400'
                                }`}
                        >
                            <Grid3x3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsGridView(false)}
                            className={`p-2 rounded-lg transition-colors ${!isGridView
                                ? darkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                                : darkMode ? 'text-gray-600' : 'text-gray-400'
                                }`}
                        >
                            <LayoutList className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {artistTracks.length === 0 ? (
                    <div className={`text-center py-16 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <Music className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                        <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>No tracks available</h3>
                    </div>
                ) : (
                    <>
                        {isGridView ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
                                {artistTracks.map((track, index) => renderTrackCard(track, index, false))}
                            </div>
                        ) : (
                            <div className={`rounded-2xl shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                {artistTracks.map((track, index) => renderTrackListItem(track, index))}
                            </div>
                        )}
                    </>
                )}
            </div>
        )
    }

    const renderTrackView = () => {
        if (!selectedTrack) return null

        const artworkUrl = getArtworkUrl(selectedTrack.artwork, '1000x1000')
        const isCurrentTrack = currentTrack?.id === selectedTrack.id

        return (
            <div className="mb-8">
                <button onClick={goBack} className={`flex items-center gap-2 mb-4 ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className={`rounded-3xl p-4 md:p-8 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        {/* Album Art */}
                        <div className="md:w-1/3">
                            <div
                                className={`relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer ${isCurrentTrack && isPlaying ? 'animate-spin-slow' : ''}`}
                                onClick={() => setShowTrackInfo(true)}
                            >
                                <img
                                    src={artworkUrl || `https://via.placeholder.com/1000x1000/6366f1/ffffff?text=${encodeURIComponent(selectedTrack.title?.[0] || 'M')}`}
                                    alt={selectedTrack.title}
                                    className="w-full h-auto"
                                />
                                {isCurrentTrack && isPlaying && (
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <AudioLines className="w-12 h-12 text-white animate-pulse" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 flex items-center justify-center transition-all">
                                    <Info className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Track Info */}
                        <div className="md:w-2/3">
                            <h1 className={`text-2xl md:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedTrack.title}</h1>
                            <button
                                onClick={() => goToArtist(selectedTrack.user?.handle)}
                                className="text-lg md:text-xl text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 mb-4 flex items-center gap-2"
                            >
                                <User className="w-5 h-5" />
                                {selectedTrack.user?.name}
                            </button>

                            {/* Stats */}
                            <div className="flex items-center gap-4 md:gap-6 mb-6">
                                {selectedTrack.play_count > 0 && (
                                    <div className="text-center">
                                        <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                                            <Headphones className="w-4 h-4 md:w-5 md:h-5" />
                                            <span className="font-semibold text-lg md:text-xl">{formatNumber(selectedTrack.play_count)}</span>
                                        </div>
                                        <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Plays</p>
                                    </div>
                                )}
                                {selectedTrack.favorite_count > 0 && (
                                    <div className="text-center">
                                        <div className="flex items-center gap-1 text-red-500">
                                            <Heart className="w-4 h-4 md:w-5 md:h-5" />
                                            <span className="font-semibold text-lg md:text-xl">{formatNumber(selectedTrack.favorite_count)}</span>
                                        </div>
                                        <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Likes</p>
                                    </div>
                                )}
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                                {selectedTrack.genre && (
                                    <div className={`p-3 md:p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <Disc3 className={`w-4 h-4 md:w-5 md:h-5 mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                        <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Genre</p>
                                        <p className={`font-semibold text-sm md:text-base line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedTrack.genre}</p>
                                    </div>
                                )}
                                {selectedTrack.duration > 0 && (
                                    <div className={`p-3 md:p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <Clock className={`w-4 h-4 md:w-5 md:h-5 mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                        <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Duration</p>
                                        <p className={`font-semibold text-sm md:text-base ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatDuration(selectedTrack.duration)}</p>
                                    </div>
                                )}
                                {selectedTrack.mood && (
                                    <div className={`p-3 md:p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <HeartPulse className={`w-4 h-4 md:w-5 md:h-5 mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                        <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mood</p>
                                        <p className={`font-semibold text-sm md:text-base line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedTrack.mood}</p>
                                    </div>
                                )}
                                {selectedTrack.release_date && (
                                    <div className={`p-3 md:p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <Calendar className={`w-4 h-4 md:w-5 md:h-5 mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                        <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Released</p>
                                        <p className={`font-semibold text-sm md:text-base ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatDate(selectedTrack.release_date)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {selectedTrack.description && (
                                <div className="mb-6">
                                    <h3 className={`font-semibold mb-2 text-sm md:text-base ${darkMode ? 'text-white' : 'text-gray-800'}`}>Description</h3>
                                    <p className={`text-xs md:text-sm leading-relaxed line-clamp-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedTrack.description}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 md:gap-3">
                                <button
                                    onClick={() => playTrack(selectedTrack, [selectedTrack])}
                                    className="flex-1 py-2.5 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 text-sm md:text-base"
                                >
                                    {isCurrentTrack && isPlaying ? (
                                        <>
                                            <Pause className="w-4 h-4 md:w-5 md:h-5" />
                                            <span className="hidden sm:inline">Pause</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 md:w-5 md:h-5" />
                                            <span className="hidden sm:inline">Play</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => toggleLike(selectedTrack.id)}
                                    className={`flex-1 py-2.5 md:py-3 rounded-xl font-medium flex items-center justify-center gap-2 text-sm md:text-base ${likedTracks[selectedTrack.id]
                                        ? 'bg-red-500 text-white'
                                        : darkMode
                                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Heart className={`w-4 h-4 md:w-5 md:h-5 ${likedTracks[selectedTrack.id] ? 'fill-white' : ''}`} />
                                    <span className="hidden sm:inline">{likedTracks[selectedTrack.id] ? 'Liked' : 'Like'}</span>
                                </button>

                                <button
                                    onClick={() => openShareModal(selectedTrack)}
                                    className={`p-2.5 md:p-3 rounded-xl ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                                </button>

                                <button
                                    onClick={() => addToPlaylist(selectedTrack)}
                                    className={`p-2.5 md:p-3 rounded-xl ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
                                </button>

                                <button
                                    onClick={() => setShowTrackInfo(true)}
                                    className={`p-2.5 md:p-3 rounded-xl ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    <Info className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Tracks */}
                {artistTracks.length > 1 && (
                    <div className="mt-8">
                        <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>More from {selectedTrack.user?.name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {artistTracks
                                .filter(t => t.id !== selectedTrack.id)
                                .slice(0, 4)
                                .map((track, index) => renderTrackCard(track, index, false))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const renderTrackInfoModal = () => {
        if (!selectedTrackForInfo && !selectedTrack) return null
        const track = selectedTrackForInfo || selectedTrack

        return (
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => {
                    setShowTrackInfo(false)
                    setSelectedTrackForInfo(null)
                }}
            >
                <div
                    className={`rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-4 md:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Track Information</h2>
                        <button
                            onClick={() => {
                                setShowTrackInfo(false)
                                setSelectedTrackForInfo(null)
                            }}
                            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                            <img
                                src={getArtworkUrl(track.artwork, '1000x1000') || `https://via.placeholder.com/1000x1000/6366f1/ffffff?text=${encodeURIComponent(track.title?.[0] || 'M')}`}
                                alt={track.title}
                                className="w-full rounded-2xl shadow-lg"
                            />
                        </div>

                        <div className="md:w-2/3">
                            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{track.title}</h3>
                            <p className={`text-lg mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{track.user?.name}</p>

                            <div className="space-y-4">
                                <div>
                                    <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>About</p>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {track.description || 'No description available'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {track.genre && (
                                        <div>
                                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Genre</p>
                                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{track.genre}</p>
                                        </div>
                                    )}
                                    {track.mood && (
                                        <div>
                                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Mood</p>
                                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{track.mood}</p>
                                        </div>
                                    )}
                                    {track.release_date && (
                                        <div>
                                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Released</p>
                                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatDate(track.release_date)}</p>
                                        </div>
                                    )}
                                    {track.duration > 0 && (
                                        <div>
                                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Duration</p>
                                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatDuration(track.duration)}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <div className="text-center">
                                        <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatNumber(track.play_count)}</p>
                                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Plays</p>
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatNumber(track.favorite_count)}</p>
                                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Likes</p>
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatNumber(track.repost_count)}</p>
                                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Reposts</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderSettingsModal = () => (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
        >
            <div
                className={`rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto p-4 md:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h2>
                    <button
                        onClick={() => setShowSettings(false)}
                        className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Theme */}
                    <div>
                        <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Theme</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => setDarkMode(false)}
                                className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-colors ${!darkMode
                                    ? 'bg-indigo-600 text-white'
                                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <Sun className="w-5 h-5" />
                                <span className="text-xs">Light</span>
                            </button>
                            <button
                                onClick={() => setDarkMode(true)}
                                className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-colors ${darkMode
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <Moon className="w-5 h-5" />
                                <span className="text-xs">Dark</span>
                            </button>
                            <button
                                onClick={() => {
                                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                                    setDarkMode(prefersDark)
                                }}
                                className={`p-3 rounded-xl flex flex-col items-center gap-2 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <Monitor className="w-5 h-5" />
                                <span className="text-xs">System</span>
                            </button>
                        </div>
                    </div>

                    {/* View Mode */}
                    <div>
                        <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Default View</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setIsGridView(true)}
                                className={`p-3 rounded-xl flex items-center justify-center gap-2 ${isGridView
                                    ? 'bg-indigo-600 text-white'
                                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <Grid3x3 className="w-5 h-5" />
                                <span>Grid</span>
                            </button>
                            <button
                                onClick={() => setIsGridView(false)}
                                className={`p-3 rounded-xl flex items-center justify-center gap-2 ${!isGridView
                                    ? 'bg-indigo-600 text-white'
                                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <LayoutList className="w-5 h-5" />
                                <span>List</span>
                            </button>
                        </div>
                    </div>

                    {/* Data Management */}
                    <div>
                        <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Data Management</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    if (window.confirm('Clear all liked tracks?')) {
                                        setLikedTracks({})
                                    }
                                }}
                                className={`w-full p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                <span>Clear Liked Tracks</span>
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm('Clear all playlists?')) {
                                        setPlaylists([])
                                    }
                                }}
                                className={`w-full p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                <span>Clear All Playlists</span>
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={clearRecentSearches}
                                className={`w-full p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                <span>Clear Recent Searches</span>
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* About */}
                    <div>
                        <button
                            onClick={() => {
                                setShowSettings(false)
                                setShowAbout(true)
                            }}
                            className={`w-full p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <span>About XoltMusic</span>
                            <Info className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderAboutModal = () => (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAbout(false)}
        >
            <div
                className={`rounded-3xl max-w-md w-full p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>About XoltMusic</h2>
                    <button
                        onClick={() => setShowAbout(false)}
                        className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Music className="w-10 h-10 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>XoltMusic</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Version 1.0.0</p>
                </div>

                <div className={`space-y-4 mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p>
                        XoltMusic is a modern music streaming platform powered by the Audius protocol.
                        Discover millions of tracks, create playlists, and enjoy unlimited music.
                    </p>
                    <p>
                        Features:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Stream millions of tracks from Audius</li>
                        <li>Create and manage custom playlists</li>
                        <li>Dark/Light theme support</li>
                        <li>Offline playback support</li>
                        <li>High-quality audio streaming</li>
                        <li>Artist discovery and following</li>
                    </ul>
                </div>

                <div className="flex justify-center gap-4">
                    <a
                        href="#"
                        className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <Twitter className="w-5 h-5" />
                    </a>
                    <a
                        href="#"
                        className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <Facebook className="w-5 h-5" />
                    </a>
                    <a
                        href="#"
                        className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <Instagram className="w-5 h-5" />
                    </a>
                </div>

                <p className={`text-xs text-center mt-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    © 2024 XoltMusic. All rights reserved.
                </p>
            </div>
        </div>
    )

    // ==================== MAIN RENDER ====================
    return (
        <div className={`min-h-screen transition-colors duration-300 pb-32 md:pb-36 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'}`}>
            {/* Audio Element */}
            <audio
                ref={audioRef}
                src={currentTrack?.stream_url}
                preload="metadata"
            />

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 md:hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                XoltMusic
                            </h2>
                            <button
                                onClick={() => setShowMobileMenu(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                            >
                                <X className="w-6 h-6 dark:text-white" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    goHome()
                                    setShowMobileMenu(false)
                                }}
                                className="flex items-center gap-3 w-full p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl"
                            >
                                <Home className="w-5 h-5" />
                                <span className="font-medium">Home</span>
                            </button>
                            <button
                                onClick={() => {
                                    setShowPlaylists(true)
                                    setShowMobileMenu(false)
                                }}
                                className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl dark:text-white"
                            >
                                <ListMusic className="w-5 h-5" />
                                <span className="font-medium">Playlists</span>
                            </button>
                            <button
                                onClick={() => {
                                    setShowSettings(true)
                                    setShowMobileMenu(false)
                                }}
                                className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl dark:text-white"
                            >
                                <Settings className="w-5 h-5" />
                                <span className="font-medium">Settings</span>
                            </button>
                            <button
                                onClick={() => {
                                    setShowAbout(true)
                                    setShowMobileMenu(false)
                                }}
                                className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl dark:text-white"
                            >
                                <Info className="w-5 h-5" />
                                <span className="font-medium">About</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className={`sticky top-0 backdrop-blur-md z-40 border-b transition-colors duration-300 ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-100'}`}>
                <div className="container mx-auto px-4 py-3 md:py-4 max-w-7xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowMobileMenu(true)}
                                className={`p-2 rounded-full lg:hidden transition-colors ${darkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                                aria-label="Menu"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <h1
                                onClick={goHome}
                                className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
                            >
                                XoltMusic
                            </h1>
                        </div>

                        <div className="flex items-center gap-2 md:gap-3">
                            {/* Back Button */}
                            {(currentView !== 'home' || showSearch || showMobileMenu || showFullPlayer || showPlaylists || showQueue || showShareModal || showAbout || showSettings) && (
                                <button
                                    onClick={goBack}
                                    className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                                    aria-label="Back"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            )}

                            {/* Search */}
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className={`p-2 rounded-full relative transition-colors ${darkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5" />
                                {showSearch && <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full" />}
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                                aria-label="Toggle theme"
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* Time Period */}
                            {currentView === 'home' && (
                                <div className={`hidden md:flex items-center gap-2 p-1 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    {timePeriods.map((period) => {
                                        const Icon = period.icon
                                        return (
                                            <button
                                                key={period.value}
                                                onClick={() => setTimePeriod(period.value)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${timePeriod === period.value
                                                    ? darkMode
                                                        ? 'bg-gray-700 text-white'
                                                        : 'bg-white text-indigo-600 shadow-sm'
                                                    : darkMode
                                                        ? 'text-gray-400 hover:text-white'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {period.label}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search Bar */}
                    {showSearch && (
                        <div className="mt-4">
                            <div className="relative">
                                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search tracks, artists..."
                                    className={`w-full pl-12 pr-4 py-3 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-sm md:text-base transition-colors ${darkMode
                                        ? 'bg-gray-800 text-white placeholder-gray-500'
                                        : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                                        }`}
                                    autoFocus
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('')
                                            setActiveTab('trending')
                                        }}
                                        className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                                            }`}
                                        aria-label="Clear search"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Search Suggestions */}
                            {searchQuery && recentSearches.length > 0 && (
                                <div className={`mt-2 p-2 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                                    {recentSearches
                                        .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .slice(0, 5)
                                        .map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSearch(suggestion)}
                                                className={`w-full text-left p-2 rounded-lg text-sm flex items-center gap-2 ${darkMode
                                                    ? 'hover:bg-gray-700 text-gray-300'
                                                    : 'hover:bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                <Search className="w-4 h-4 text-gray-400" />
                                                {suggestion}
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
                {currentView === 'home' && (activeTab === 'search' && searchQuery ? renderSearchView() : renderHomeView())}
                {currentView === 'artist' && renderArtistView()}
                {currentView === 'track' && renderTrackView()}
            </div>

            {/* Now Playing Mini Player */}
            {currentTrack && (
                <div className={`fixed bottom-0 left-0 right-0 border-t shadow-2xl p-3 md:p-4 z-40 md:bottom-4 md:left-4 md:right-4 md:rounded-2xl md:border md:max-w-2xl md:mx-auto transition-colors duration-300 ${darkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden shadow-md flex-shrink-0 cursor-pointer ${isPlaying ? 'animate-spin-slow' : ''}`}
                            onClick={() => setShowFullPlayer(true)}
                        >
                            <img
                                src={currentTrack.cover}
                                alt={currentTrack.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => setShowFullPlayer(true)}
                        >
                            <h4 className={`font-semibold text-xs md:text-sm line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {currentTrack.title}
                            </h4>
                            <p className={`text-xs line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {currentTrack.performer}
                            </p>
                        </div>

                        <div className="flex items-center gap-1 md:gap-2">
                            <button
                                onClick={playPreviousTrack}
                                className={`p-1.5 md:p-2 rounded-full hidden md:block transition-colors ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                aria-label="Previous track"
                            >
                                <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
                            </button>

                            <button
                                onClick={() => isPlaying ? pauseTrack() : resumeTrack()}
                                className="p-2 md:p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white shadow-lg"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ?
                                    <Pause className="w-4 h-4 md:w-5 md:h-5" /> :
                                    <Play className="w-4 h-4 md:w-5 md:h-5 ml-0.5" />
                                }
                            </button>

                            <button
                                onClick={playNextTrack}
                                className={`p-1.5 md:p-2 rounded-full hidden md:block transition-colors ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                aria-label="Next track"
                            >
                                <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
                            </button>

                            <button
                                onClick={() => setShowFullPlayer(true)}
                                className={`p-1.5 md:p-2 rounded-full ml-1 transition-colors ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                aria-label="Full player"
                            >
                                <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-2">
                        <input
                            type="range"
                            min={0}
                            max={duration || 100}
                            value={progress}
                            onChange={(e) => seekTo(parseFloat(e.target.value))}
                            className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${(progress / (duration || 1)) * 100}%, ${darkMode ? '#374151' : '#e5e7eb'} ${(progress / (duration || 1)) * 100}%)`
                            }}
                            aria-label="Progress"
                        />
                        <div className="flex justify-between text-xs mt-1">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                {formatDuration(progress)}
                            </span>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                {formatDuration(duration)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {showShareModal && selectedTrack && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowShareModal(false)}
                >
                    <div
                        className={`rounded-3xl max-w-md w-full p-4 md:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Share Track
                            </h2>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className={`flex items-center gap-3 p-3 rounded-xl mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <img
                                src={getArtworkUrl(selectedTrack.artwork, '150x150') || `https://via.placeholder.com/150x150/6366f1/ffffff?text=${encodeURIComponent(selectedTrack.title?.[0] || 'M')}`}
                                alt={selectedTrack.title}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold text-xs md:text-sm line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {selectedTrack.title}
                                </h3>
                                <p className={`text-xs line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {selectedTrack.user?.name}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 md:gap-3 mb-6">
                            {[
                                { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/track/${selectedTrack.id}`)}` },
                                { name: 'Twitter', icon: Twitter, color: 'bg-sky-500', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${selectedTrack.title}" on XoltMusic!`)}&url=${encodeURIComponent(`${window.location.origin}/track/${selectedTrack.id}`)}` },
                                { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500', url: '#' },
                                { name: 'Telegram', icon: MessageCircle, color: 'bg-blue-500', url: `https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/track/${selectedTrack.id}`)}` }
                            ].map((link) => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${link.color} text-white p-3 md:p-4 rounded-xl flex flex-col items-center gap-1 md:gap-2 hover:opacity-90 transition-opacity`}
                                >
                                    <link.icon className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="text-xs">{link.name}</span>
                                </a>
                            ))}
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                value={`${window.location.origin}/track/${selectedTrack.id}`}
                                readOnly
                                className={`w-full p-2.5 md:p-3 pr-12 border rounded-xl text-xs md:text-sm ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-gray-50 border-gray-200 text-gray-900'
                                    }`}
                            />
                            <button
                                onClick={copyToClipboard}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                                    }`}
                                aria-label="Copy link"
                            >
                                {copied ?
                                    <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" /> :
                                    <Copy className={`w-4 h-4 md:w-5 md:h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Screen Player */}
            {showFullPlayer && currentTrack && (
                <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 z-50 overflow-y-auto">
                    <div className="min-h-screen flex flex-col p-4 md:p-6">
                        <div className="flex justify-between items-center mb-4 md:mb-8">
                            <button
                                onClick={() => setShowFullPlayer(false)}
                                className="p-2 md:p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                                aria-label="Close"
                            >
                                <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                            <h2 className="text-white text-base md:text-lg font-semibold">Now Playing</h2>
                            <button
                                onClick={() => setShowQueue(true)}
                                className="p-2 md:p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                                aria-label="Queue"
                            >
                                <ListMusic className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>

                        <div className={`w-48 h-48 md:w-64 md:h-64 mx-auto rounded-3xl overflow-hidden shadow-2xl mb-4 md:mb-8 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                            <img
                                src={currentTrack.cover}
                                alt={currentTrack.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="text-center text-white mb-4 md:mb-8">
                            <h1 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">{currentTrack.title}</h1>
                            <p className="text-sm md:text-base text-white/70">{currentTrack.performer}</p>
                        </div>

                        <div className="mb-4 md:mb-6">
                            <input
                                type="range"
                                min={0}
                                max={duration || 100}
                                value={progress}
                                onChange={(e) => seekTo(parseFloat(e.target.value))}
                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, #fff 0%, #fff ${(progress / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(progress / (duration || 1)) * 100}%)`
                                }}
                            />
                            <div className="flex justify-between text-white/70 text-xs md:text-sm mt-2">
                                <span>{formatDuration(progress)}</span>
                                <span>{formatDuration(duration)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
                            <button
                                onClick={() => setIsShuffling(!isShuffling)}
                                className={`p-2 md:p-3 rounded-full transition-colors ${isShuffling ? 'bg-indigo-500' : 'bg-white/10 hover:bg-white/20'
                                    } text-white`}
                                aria-label="Shuffle"
                            >
                                <Shuffle className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                            <button
                                onClick={playPreviousTrack}
                                className="p-3 md:p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                                aria-label="Previous"
                            >
                                <SkipBack className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                            <button
                                onClick={() => isPlaying ? pauseTrack() : resumeTrack()}
                                className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ?
                                    <Pause className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" /> :
                                    <Play className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 ml-1" />
                                }
                            </button>
                            <button
                                onClick={playNextTrack}
                                className="p-3 md:p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                                aria-label="Next"
                            >
                                <SkipForward className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                            <button
                                onClick={() => setRepeatMode(repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')}
                                className={`p-2 md:p-3 rounded-full transition-colors ${repeatMode !== 'none' ? 'bg-indigo-500' : 'bg-white/10 hover:bg-white/20'
                                    } text-white`}
                                aria-label="Repeat"
                            >
                                {repeatMode === 'one' ?
                                    <Repeat1 className="w-4 h-4 md:w-5 md:h-5" /> :
                                    <Repeat className="w-4 h-4 md:w-5 md:h-5" />
                                }
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Volume"
                            >
                                {isMuted || volume === 0 ?
                                    <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> :
                                    volume < 0.5 ?
                                        <Volume1 className="w-4 h-4 md:w-5 md:h-5" /> :
                                        <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                                }
                            </button>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={isMuted ? 0 : volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-24 md:w-32 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, #fff 0%, #fff ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%)`
                                }}
                                aria-label="Volume slider"
                            />
                        </div>

                        <div className="flex items-center justify-center gap-3 md:gap-4">
                            <button
                                onClick={() => toggleLike(currentTrack.id)}
                                className="p-2 md:p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                                aria-label="Like"
                            >
                                <Heart className={`w-4 h-4 md:w-5 md:h-5 ${likedTracks[currentTrack.id] ? 'fill-red-500' : ''}`} />
                            </button>
                            <button
                                onClick={() => openShareModal(currentTrack)}
                                className="p-2 md:p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                                aria-label="Share"
                            >
                                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                            <button
                                onClick={() => addToPlaylist(currentTrack)}
                                className="p-2 md:p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                                aria-label="Add to playlist"
                            >
                                <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>

                        <p className="text-center text-white/50 text-xs mt-4 md:mt-6">
                            Swipe left/right to change track
                        </p>
                    </div>
                </div>
            )}

            {/* Playlists Modal */}
            {showPlaylists && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowPlaylists(false)}
                >
                    <div
                        className={`rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-4 md:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Your Playlists
                            </h2>
                            <button
                                onClick={() => setShowPlaylists(false)}
                                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Create New Playlist */}
                        <div className="mb-6">
                            <button
                                onClick={() => {
                                    const name = prompt('Enter playlist name:')
                                    if (name) createPlaylist(name)
                                }}
                                className={`w-full p-4 border-2 border-dashed rounded-xl transition-colors flex items-center justify-center gap-2 ${darkMode
                                    ? 'border-gray-600 text-gray-400 hover:border-indigo-500 hover:text-indigo-400'
                                    : 'border-gray-300 text-gray-600 hover:border-indigo-600 hover:text-indigo-600'
                                    }`}
                            >
                                <PlusCircle className="w-5 h-5" />
                                Create New Playlist
                            </button>
                        </div>

                        {/* Playlists Grid */}
                        {playlists.length > 0 && (
                            <div className="grid grid-cols-1 gap-3 mb-6">
                                {playlists.map(playlist => (
                                    <div
                                        key={playlist.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                        onClick={() => {
                                            if (selectedTrack) {
                                                addTrackToPlaylist(playlist.id, selectedTrack)
                                                setShowPlaylists(false)
                                                setSelectedTrack(null)
                                            } else {
                                                setSelectedPlaylist(playlist)
                                            }
                                        }}
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                                            <ListMusic className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                                {playlist.name}
                                            </h3>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {playlist.tracks.length} tracks
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (window.confirm('Delete this playlist?')) {
                                                        removePlaylist(playlist.id)
                                                    }
                                                }}
                                                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                                                    }`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Featured Playlists */}
                        {featuredPlaylists.length > 0 && (
                            <>
                                <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    Featured Playlists
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {featuredPlaylists.map(playlist => renderPlaylistCard(playlist))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Playlist Detail Modal */}
            {selectedPlaylist && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedPlaylist(null)}
                >
                    <div
                        className={`rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-4 md:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {selectedPlaylist.name}
                                </h2>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {selectedPlaylist.tracks.length} tracks
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedPlaylist(null)}
                                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {selectedPlaylist.tracks.length === 0 ? (
                            <div className="text-center py-12">
                                <ListMusic className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No tracks in this playlist</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {selectedPlaylist.tracks.map((track, index) => (
                                    <div
                                        key={track.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                            }`}
                                        onClick={() => {
                                            playTrack(track, selectedPlaylist.tracks)
                                            setSelectedPlaylist(null)
                                        }}
                                    >
                                        <span className={`text-sm w-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {index + 1}
                                        </span>
                                        <img
                                            src={track.cover}
                                            alt={track.title}
                                            className="w-10 h-10 rounded-lg object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-medium text-sm line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                                {track.title}
                                            </h4>
                                            <p className={`text-xs line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {track.performer}
                                            </p>
                                        </div>
                                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {formatDuration(track.duration)}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                removeTrackFromPlaylist(selectedPlaylist.id, track.id)
                                            }}
                                            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                                                }`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Queue Modal */}
            {showQueue && currentTrack && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
                    onClick={() => setShowQueue(false)}
                >
                    <div
                        className={`rounded-t-3xl md:rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-4 md:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Queue
                            </h2>
                            <button
                                onClick={() => setShowQueue(false)}
                                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {queue.length === 0 ? (
                            <div className="text-center py-12">
                                <ListMusic className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Queue is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {queue.map((track, index) => {
                                    const isCurrent = currentTrack?.id === track.id
                                    return (
                                        <div
                                            key={track.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isCurrent
                                                ? darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'
                                                : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                                }`}
                                            onClick={() => playTrack(track, queue)}
                                        >
                                            <span className={`text-sm w-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {index + 1}
                                            </span>
                                            <img
                                                src={track.cover}
                                                alt={track.title}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`font-medium text-sm line-clamp-1 ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : (darkMode ? 'text-white' : 'text-gray-800')
                                                    }`}>
                                                    {track.title}
                                                </h4>
                                                <p className={`text-xs line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {track.performer}
                                                </p>
                                            </div>
                                            {isCurrent && isPlaying && (
                                                <div className="flex gap-0.5">
                                                    <div className="w-1 h-1 bg-indigo-600 rounded-full animate-pulse" />
                                                    <div className="w-1 h-1 bg-indigo-600 rounded-full animate-pulse delay-75" />
                                                    <div className="w-1 h-1 bg-indigo-600 rounded-full animate-pulse delay-150" />
                                                </div>
                                            )}
                                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {formatDuration(track.duration)}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Track Info Modal */}
            {showTrackInfo && renderTrackInfoModal()}

            {/* Settings Modal */}
            {showSettings && renderSettingsModal()}

            {/* About Modal */}
            {showAbout && renderAboutModal()}

            {/* Add CSS for animations */}
            <style jsx>{`
                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: ${darkMode ? '#1f2937' : '#f1f1f1'};
                }
                
                ::-webkit-scrollbar-thumb {
                    background: ${darkMode ? '#4b5563' : '#888'};
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: ${darkMode ? '#6b7280' : '#555'};
                }
                
                /* Range input styling */
                input[type=range] {
                    -webkit-appearance: none;
                    appearance: none;
                }
                
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background: ${darkMode ? '#fff' : '#4f46e5'};
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                
                input[type=range]::-moz-range-thumb {
                    width: 12px;
                    height: 12px;
                    background: ${darkMode ? '#fff' : '#4f46e5'};
                    border-radius: 50%;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    )
};