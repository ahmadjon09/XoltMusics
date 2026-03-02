import React, {
    createContext,
    useState,
    useContext,
    useRef,
    useEffect,
    useMemo,
    useCallback,
} from "react";

const MusicContext = createContext(null);

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) throw new Error("useMusic must be used within MusicProvider");
    return context;
};

export const MusicProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState({});
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false); // false => off, true => repeat all
    const [queue, setQueue] = useState([]);
    const [queueIndex, setQueueIndex] = useState(-1);

    const audioRef = useRef(new Audio());

    // --- Refs to avoid stale closures in events ---
    const queueRef = useRef(queue);
    const queueIndexRef = useRef(queueIndex);
    const isShuffleRef = useRef(isShuffle);
    const isRepeatRef = useRef(isRepeat);

    useEffect(() => {
        queueRef.current = queue;
    }, [queue]);

    useEffect(() => {
        queueIndexRef.current = queueIndex;
    }, [queueIndex]);

    useEffect(() => {
        isShuffleRef.current = isShuffle;
    }, [isShuffle]);

    useEffect(() => {
        isRepeatRef.current = isRepeat;
    }, [isRepeat]);

    // --- Keep volume in sync ---
    useEffect(() => {
        audioRef.current.volume = isMuted ? 0 : volume;
    }, [volume, isMuted]);

    // --- Load track src & play if needed ---
    useEffect(() => {
        const audio = audioRef.current;
        if (!currentTrack) return;

        audio.src = currentTrack.audio_url;
        audio.currentTime = 0;

        if (isPlaying) {
            audio.play().catch(() => setIsPlaying(false));
        }
    }, [currentTrack, isPlaying]);

    // --- Play / Pause control ---
    useEffect(() => {
        const audio = audioRef.current;
        if (!currentTrack) return;

        if (isPlaying) {
            audio.play().catch(() => setIsPlaying(false));
        } else {
            audio.pause();
        }
    }, [isPlaying, currentTrack]);

    // --- Audio events (timeupdate, metadata, ended) ---
    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            const dur = audio.duration || 0;
            const ct = audio.currentTime || 0;

            setCurrentTime(ct);
            setDuration(dur);
            setProgress(dur ? (ct / dur) * 100 : 0);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration || 0);
        };

        const handleEnded = () => {
            const q = queueRef.current;
            const qi = queueIndexRef.current;

            if (!q.length || qi === -1) return;

            let nextIndex;

            if (isShuffleRef.current) {
                if (q.length === 1) nextIndex = 0;
                else {
                    nextIndex = qi;
                    while (nextIndex === qi) nextIndex = Math.floor(Math.random() * q.length);
                }
            } else {
                nextIndex = qi + 1;
                if (nextIndex >= q.length) nextIndex = isRepeatRef.current ? 0 : -1;
            }

            if (nextIndex === -1) {
                setIsPlaying(false);
                return;
            }

            setQueueIndex(nextIndex);
            setCurrentTrack(q[nextIndex]);
            setIsPlaying(true);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    // --- Controls ---
    const playTrack = useCallback(
        (track, trackList = []) => {
            const newQueue = trackList.length > 0 ? trackList : tracks;
            setQueue(newQueue);

            const index = newQueue.findIndex((t) => t.index === track.index);
            setQueueIndex(index);

            setCurrentTrack(track);
            setIsPlaying(true);
        },
        [tracks]
    );

    const playNext = useCallback(() => {
        const q = queueRef.current;
        const qi = queueIndexRef.current;

        if (!q.length || qi === -1) return;

        let nextIndex;

        if (isShuffleRef.current) {
            if (q.length === 1) nextIndex = 0;
            else {
                nextIndex = qi;
                while (nextIndex === qi) nextIndex = Math.floor(Math.random() * q.length);
            }
        } else {
            nextIndex = qi + 1;
            if (nextIndex >= q.length) nextIndex = isRepeatRef.current ? 0 : -1;
        }

        if (nextIndex === -1) {
            setIsPlaying(false);
            return;
        }

        setQueueIndex(nextIndex);
        setCurrentTrack(q[nextIndex]);
        setIsPlaying(true);
    }, []);

    const playPrev = useCallback(() => {
        const q = queueRef.current;
        const qi = queueIndexRef.current;

        if (!q.length || qi === -1) return;

        let prevIndex = qi - 1;
        if (prevIndex < 0) prevIndex = isRepeatRef.current ? q.length - 1 : -1;

        if (prevIndex === -1) return;

        setQueueIndex(prevIndex);
        setCurrentTrack(q[prevIndex]);
        setIsPlaying(true);
    }, []);

    const toggleLike = useCallback((trackId) => {
        setIsLiked((prev) => ({ ...prev, [trackId]: !prev[trackId] }));
    }, []);

    const seekTo = useCallback((time) => {
        const audio = audioRef.current;
        const dur = audio.duration || 0;
        const t = Math.max(0, Math.min(Number(time || 0), dur));
        audio.currentTime = t;
    }, []);

    const value = useMemo(
        () => ({
            currentTrack,
            tracks,
            setTracks,
            isPlaying,
            setIsPlaying,
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
            queueIndex,
            playTrack,
            playNext,
            playPrev,
            seekTo,
            audioRef, // agar kerak bo'lsa
        }),
        [
            currentTrack,
            tracks,
            isPlaying,
            isPlayerExpanded,
            isLiked,
            toggleLike,
            volume,
            isMuted,
            progress,
            duration,
            currentTime,
            isShuffle,
            isRepeat,
            queue,
            queueIndex,
            playTrack,
            playNext,
            playPrev,
            seekTo,
        ]
    );

    return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};