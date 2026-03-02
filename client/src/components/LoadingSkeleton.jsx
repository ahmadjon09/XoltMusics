import { motion } from "framer-motion"

export const LoadingSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-32 md:pb-24">
            <div className="container mx-auto px-4 py-6">
                {/* Hero Skeleton */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl p-6 md:p-8 animate-pulse">
                        <div className="h-8 w-48 bg-gray-400 rounded mb-4"></div>
                        <div className="h-4 w-64 bg-gray-400 rounded mb-4"></div>
                        <div className="h-10 w-32 bg-gray-400 rounded"></div>
                    </div>
                </div>

                {/* Top Charts Skeleton */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-6 w-32 bg-gray-300 rounded"></div>
                        <div className="h-4 w-16 bg-gray-300 rounded"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                        {[...Array(10)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-xl shadow-sm overflow-hidden"
                            >
                                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                                <div className="p-3">
                                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Recently Played Skeleton */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-5 w-5 bg-gray-300 rounded"></div>
                        <div className="h-6 w-40 bg-gray-300 rounded"></div>
                    </div>

                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-xl p-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                                        <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                                    </div>
                                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Shimmer Loading Effect
export const ShimmerLoading = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6">
                {/* Hero Shimmer */}
                <div className="mb-8 relative overflow-hidden">
                    <div className="bg-gray-200 rounded-2xl p-6 md:p-8">
                        <div className="relative">
                            <div className="h-8 w-48 bg-gray-300 rounded mb-4"></div>
                            <div className="h-4 w-64 bg-gray-300 rounded mb-4"></div>
                            <div className="h-10 w-32 bg-gray-300 rounded"></div>
                            {/* Shimmer overlay */}
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                        </div>
                    </div>
                </div>

                {/* Grid Shimmer */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden relative">
                            <div className="aspect-square bg-gray-200"></div>
                            <div className="p-3">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}