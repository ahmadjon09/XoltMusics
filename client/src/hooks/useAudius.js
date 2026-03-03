import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

export const BASE_URL = 'https://discoveryprovider.audius.co/v1'

const fetcher = async (url) => {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error('Failed to fetch data from Audius')
    }
    return res.json()
}

// Trending treklarni olish
export const useTrendingTracks = (time = 'week', limit = 20) => {
    const { data, error, isLoading } = useSWR(
        `${BASE_URL}/tracks/trending?time=${time}&limit=${limit}`,
        fetcher
    )

    return {
        tracks: data?.data || [],
        error,
        isLoading
    }
}

// Track qidirish
export const useSearchTracks = (query, limit = 20) => {
    const { data, error, isLoading } = useSWR(
        query ? `${BASE_URL}/tracks/search?query=${encodeURIComponent(query)}&limit=${limit}` : null,
        fetcher
    )

    return {
        tracks: data?.data || [],
        error,
        isLoading
    }
}

// Trackni ID bo'yicha olish
export const useTrackById = (trackId) => {
    const { data, error, isLoading } = useSWR(
        trackId ? `${BASE_URL}/tracks/${trackId}` : null,
        fetcher
    )

    return {
        track: data?.data || null,
        error,
        isLoading
    }
}

// Userlarni qidirish
export const useSearchUsers = (query, limit = 10) => {
    const { data, error, isLoading } = useSWR(
        query ? `${BASE_URL}/users/search?query=${encodeURIComponent(query)}&limit=${limit}` : null,
        fetcher
    )

    return {
        users: data?.data || [],
        error,
        isLoading
    }
}

// Infinite scroll uchun trending treklar
export const useInfiniteTrendingTracks = (time = 'week', limit = 20) => {
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.data?.length) return null

        if (pageIndex === 0) {
            return `${BASE_URL}/tracks/trending?time=${time}&limit=${limit}`
        }

        const offset = pageIndex * limit
        return `${BASE_URL}/tracks/trending?time=${time}&limit=${limit}&offset=${offset}`
    }

    const { data, error, isLoading, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher)

    const tracks = data ? data.flatMap(page => page.data || []) : []
    const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
    const isEmpty = data?.[0]?.data?.length === 0
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.data?.length < limit)

    return {
        tracks,
        error,
        isLoading,
        isLoadingMore,
        isEmpty,
        isReachingEnd,
        loadMore: () => setSize(size + 1)
    }
}