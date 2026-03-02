import useSWR from "swr";
import Fetch from "./fetcher";

/**
 * @param {string} query
 */
export function useSearchTracks(query) {
    const q = query?.trim();

    const key = q ? `/search?q=${encodeURIComponent(q)}` : null;

    return useSWR(key, Fetch, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        dedupingInterval: 60000,
        refreshInterval: 0,
        shouldRetryOnError: false,
        keepPreviousData: true,
    });
}