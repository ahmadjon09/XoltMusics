import { useTranslation } from "../hooks/UseLanguage"
import { motion, AnimatePresence } from "framer-motion"
import {
    Lock,
    Eye,
    EyeOff,
    LogIn,
    Music,
    AlertCircle,
    ArrowLeft,
    User
} from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Fetch from "../hooks/fetcher"
import Cookies from 'js-cookie'

export const Login = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    // Form states
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [rememberMe, setRememberMe] = useState(false)

    // Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        if (error) setError("")
    }

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setIsLoading(true)

        try {
            const response = await Fetch.post("/user/auth/login", formData)

            if (response.success) {
                setSuccess(t('loginSuccess') || "Login successful!")

                // Set cookies with expiration
                const cookieOptions = {
                    expires: rememberMe ? 30 : 1, // 30 days if remember me, else 1 day
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                }

                // Save to cookies
                Cookies.set('token', response.token, cookieOptions)
                Cookies.set('user', JSON.stringify(response.user), cookieOptions)

                // Also save username for remember me functionality
                if (rememberMe) {
                    Cookies.set('savedUsername', formData.username, { expires: 30 })
                } else {
                    Cookies.remove('savedUsername')
                }

                // Redirect to home after 1.5 seconds
                setTimeout(() => {
                    navigate("/")
                }, 1500)
            } else {
                setError(response.message || t('loginFailed') || "Invalid username or password")
            }
        } catch (err) {
            setError(err.response?.data?.message || t('serverError') || "Server error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // Check for saved username on component mount
    useState(() => {
        const savedUsername = Cookies.get('savedUsername')
        if (savedUsername) {
            setFormData(prev => ({ ...prev, username: savedUsername }))
            setRememberMe(true)
        }
    }, [])

    return (
        <div className="min-h-screen z-60 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-indigo-200/20"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            rotate: 0,
                            scale: 0.5 + Math.random() * 0.5
                        }}
                        animate={{
                            y: [null, -200],
                            rotate: 360,
                            opacity: [0.2, 0]
                        }}
                        transition={{
                            duration: 15 + Math.random() * 15,
                            repeat: Infinity,
                            delay: Math.random() * 8
                        }}
                    >
                        <Music className="w-16 h-16" />
                    </motion.div>
                ))}
            </div>

            {/* Back Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="fixed top-4 left-4 z-10"
            >
                <Link
                    to="/"
                    className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm text-gray-600">{t('backToHome') || "Back to Home"}</span>
                </Link>
            </motion.div>

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
                    {/* Logo and Title */}
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-8"
                    >

                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {t('welcomeBack') || "Welcome Back!"}
                        </h1>
                        <p className="text-gray-500 mt-2">
                            {t('loginSubtitle') || "Sign in to continue your music journey"}
                        </p>
                    </motion.div>

                    {/* Error/Success Messages */}
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-sm text-red-600">{error}</p>
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                            >
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                </div>
                                <p className="text-sm text-green-600">{success}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('username') || "Username"}
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder={t('usernamePlaceholder') || "Enter your username"}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all outline-none"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('password') || "Password"}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={t('passwordPlaceholder') || "Enter your password"}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all outline-none"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-600">
                                    {t('rememberMe') || "Remember me"}
                                </span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                            >
                                {t('forgotPassword') || "Forgot password?"}
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>{t('loggingIn') || "Logging in..."}</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>{t('login') || "Login"}</span>
                                </>
                            )}
                        </motion.button>

                        {/* Register Link */}
                        <p className="text-center text-gray-600">
                            {t('noAccount') || "Don't have an account?"}{" "}
                            <Link
                                to="/register"
                                className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                            >
                                {t('register') || "Register"}
                            </Link>
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}