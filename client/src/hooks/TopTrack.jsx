import useSWR from "swr";
import Fetch from "./fetcher";
export function useTopTracks() {
    return useSWR("/top", Fetch, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        dedupingInterval: 60000,
        refreshInterval: 0,
        shouldRetryOnError: false,
        keepPreviousData: true,
    });
}