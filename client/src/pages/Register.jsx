import { useTranslation } from "../hooks/UseLanguage"
import { motion, AnimatePresence } from "framer-motion"
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Music,
    AlertCircle,
    ArrowLeft,
    UserPlus,
    CheckCircle
} from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Fetch from "../hooks/fetcher"
import Cookies from 'js-cookie'

export const Register = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    // Form states
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [agreeTerms, setAgreeTerms] = useState(false)

    // Password strength
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        number: false,
        uppercase: false,
        lowercase: false,
        special: false
    })

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })

        if (error) setError("")

        // Check password strength
        if (name === "password") {
            setPasswordStrength({
                length: value.length >= 8,
                number: /\d/.test(value),
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
            })
        }
    }

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError(t('passwordsDoNotMatch') || "Passwords do not match")
            return
        }

        if (!agreeTerms) {
            setError(t('agreeTermsRequired') || "Please agree to the terms and conditions")
            return
        }

        // Check password strength
        const strengthValues = Object.values(passwordStrength)
        if (strengthValues.filter(Boolean).length < 4) {
            setError(t('weakPassword') || "Please choose a stronger password")
            return
        }

        setIsLoading(true)

        try {
            const response = await Fetch.post("/user/auth/register", {
                username: formData.username,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName
            })

            if (response.success) {
                setSuccess(t('registrationSuccess') || "Registration successful!")

                // Auto login after registration
                const loginResponse = await Fetch.post("/auth/login", {
                    username: formData.username,
                    password: formData.password
                })

                if (loginResponse.success) {
                    // Set cookies
                    Cookies.set('token', loginResponse.token, {
                        expires: 7,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict'
                    })
                    Cookies.set('user', JSON.stringify(loginResponse.user), { expires: 7 })
                }

                // Redirect to home after 2 seconds
                setTimeout(() => {
                    navigate("/")
                }, 2000)
            } else {
                setError(response.message || t('registrationFailed') || "Registration failed")
            }
        } catch (err) {
            setError(err.response?.data?.message || t('serverError') || "Server error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // Password strength indicator
    const strengthPercentage = Object.values(passwordStrength).filter(Boolean).length * 20
    const strengthColor =
        strengthPercentage <= 40 ? 'bg-red-500' :
            strengthPercentage <= 60 ? 'bg-orange-500' :
                strengthPercentage <= 80 ? 'bg-yellow-500' :
                    'bg-green-500'

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
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
                            {t('createAccount') || "Create Account"}
                        </h1>
                        <p className="text-gray-500 mt-2">
                            {t('registerSubtitle') || "Join XoltMusic and start your journey"}
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
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <p className="text-sm text-green-600">{success}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('username') || "Username"} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder={t('usernamePlaceholder') || "Choose a username"}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all outline-none"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* First Name & Last Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('firstName') || "First Name"}
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder={t('firstNamePlaceholder') || "John"}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all outline-none"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('lastName') || "Last Name"}
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder={t('lastNamePlaceholder') || "Doe"}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all outline-none"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('password') || "Password"} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={t('passwordPlaceholder') || "Create a strong password"}
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

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${strengthPercentage}%` }}
                                                className={`h-full ${strengthColor}`}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {strengthPercentage}%
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-5 gap-1 text-xs">
                                        {Object.entries(passwordStrength).map(([key, value]) => (
                                            <div
                                                key={key}
                                                className={`flex items-center justify-center gap-1 p-1 rounded ${value ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                                    }`}
                                            >
                                                <span className="w-1 h-1 rounded-full bg-current" />
                                                <span>
                                                    {key === 'length' && '8+'}
                                                    {key === 'number' && '123'}
                                                    {key === 'uppercase' && 'A'}
                                                    {key === 'lowercase' && 'a'}
                                                    {key === 'special' && '@#$'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('confirmPassword') || "Confirm Password"} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder={t('confirmPasswordPlaceholder') || "Re-enter your password"}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all outline-none"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="mt-1 text-xs text-red-500">
                                    {t('passwordsDoNotMatch') || "Passwords do not match"}
                                </p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                                {t('agreeTerms') || "I agree to the"}{" "}
                                <Link to="/terms" className="text-indigo-600 hover:underline">
                                    {t('termsOfService') || "Terms of Service"}
                                </Link>{" "}
                                {t('and') || "and"}{" "}
                                <Link to="/privacy" className="text-indigo-600 hover:underline">
                                    {t('privacyPolicy') || "Privacy Policy"}
                                </Link>
                            </label>
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
                                    <span>{t('registering') || "Creating account..."}</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    <span>{t('register') || "Create Account"}</span>
                                </>
                            )}
                        </motion.button>

                        {/* Login Link */}
                        <p className="text-center text-gray-600">
                            {t('haveAccount') || "Already have an account?"}{" "}
                            <Link
                                to="/login"
                                className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                            >
                                {t('login') || "Login"}
                            </Link>
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}