import React, { useContext, useState, useEffect } from 'react'
import { useTranslation } from '../hooks/UseLanguage'
import uz from '../assets/uz.svg'
import ru from '../assets/ru.svg'
import en from '../assets/en.svg'
import { ContextData } from '../context/Context'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import {
    Menu,
    X,
    Home,
    Search,
    Library,
    User,
    LogOut,
    Settings,
    Heart,
    Clock,
    ListMusic,
    ChevronDown
} from 'lucide-react'
import logo from '../assets/logo.png'

export const Navbar = () => {
    const { language, changeLanguage, t } = useTranslation()
    const { user } = useContext(ContextData)
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Menu yopish
    useEffect(() => {
        setIsMenuOpen(false)
        setIsLangMenuOpen(false)
        setIsProfileMenuOpen(false)
    }, [location])

    const navItems = [
        { icon: Home, label: t('home') || 'Home', path: '/?#home' },
        { icon: Search, label: t('search') || 'Search', path: '/search' },
        { icon: Library, label: t('library') || 'Library', path: '/library' },
    ]

    const userMenuItems = [
        { icon: User, label: t('profile') || 'Profile', path: '/profile' },
        { icon: Heart, label: t('favorites') || 'Favorites', path: '/favorites' },
        { icon: Clock, label: t('recentlyPlayed') || 'Recently Played', path: '/recent' },
        { icon: ListMusic, label: t('playlists') || 'Playlists', path: '/playlists' },
        { icon: Settings, label: t('settings') || 'Settings', path: '/settings' },
    ]

    const languages = [
        { code: 'uz', name: 'O\'zbek', flag: uz },
        { code: 'ru', name: 'Русский', flag: ru },
        { code: 'en', name: 'English', flag: en },
    ]

    const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

    const isActivePath = (path) => location.pathname === path

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-sm py-2 md:py-3'
                    : 'bg-white/90 backdrop-blur-sm py-3 md:py-4'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <img className="w-8 h-8 md:w-9 md:h-9" src={logo} alt="Logo" />
                            <span className="text-base sm:text-lg hidden sm:block font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                XoltMusic
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActivePath(item.path)
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-2 md:gap-3">
                            {/* Language Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                    className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-sm"
                                >
                                    <img
                                        src={currentLanguage.flag}
                                        alt={currentLanguage.name}
                                        className="w-4 h-4 md:w-5 md:h-5 rounded-sm object-cover"
                                    />
                                    <span className="hidden sm:block text-xs md:text-sm font-medium">
                                        {currentLanguage.name}
                                    </span>
                                    <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''
                                        }`} />
                                </button>

                                <AnimatePresence>
                                    {isLangMenuOpen && (
                                        <motion.div
                                            className="absolute right-0 mt-1 md:mt-2 w-36 md:w-40 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => {
                                                        changeLanguage(lang.code)
                                                        setIsLangMenuOpen(false)
                                                    }}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-indigo-50 transition-colors text-xs md:text-sm ${language === lang.code
                                                        ? 'bg-indigo-50 text-indigo-600'
                                                        : 'text-gray-700'
                                                        }`}
                                                >
                                                    <img
                                                        src={lang.flag}
                                                        alt={lang.name}
                                                        className="w-4 h-4 rounded-sm object-cover"
                                                    />
                                                    <span className="font-medium">{lang.name}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* User Menu / Auth Buttons */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        className="flex items-center gap-1 md:gap-2 px-1 md:px-2 py-1 md:py-1.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-100 transition-colors"
                                    >
                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                                            {user.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <span className="hidden lg:block text-xs md:text-sm font-medium text-gray-700">
                                            {user.username}
                                        </span>
                                        <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-gray-600 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''
                                            }`} />
                                    </button>

                                    <AnimatePresence>
                                        {isProfileMenuOpen && (
                                            <motion.div
                                                className="absolute right-0 mt-1 md:mt-2 w-48 md:w-56 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <div className="px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                                                    <p className="font-semibold text-gray-800 text-sm">{user.username}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {user.firstName || user.lastName
                                                            ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                                                            : 'Music Lover'}
                                                    </p>
                                                </div>

                                                <div className="p-1">
                                                    {userMenuItems.map((item) => (
                                                        <Link
                                                            key={item.path}
                                                            to={item.path}
                                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 transition-colors text-sm"
                                                            onClick={() => setIsProfileMenuOpen(false)}
                                                        >
                                                            <item.icon className="w-4 h-4 text-gray-500" />
                                                            <span>{item.label}</span>
                                                        </Link>
                                                    ))}

                                                    <button
                                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm mt-1 border-t border-gray-100 pt-2"
                                                        onClick={() => {
                                                            // Logout logic
                                                            setIsProfileMenuOpen(false)
                                                        }}
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        <span>{t('logout') || 'Logout'}</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 md:gap-2">
                                    <Link
                                        to="/login"
                                        className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-50 font-medium transition-colors text-sm"
                                    >
                                        {t('login') || 'Login'}
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm shadow-sm hover:shadow"
                                    >
                                        {t('register') || 'Register'}
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="fixed inset-0 top-[57px] md:top-[65px] bg-white z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="container mx-auto px-4 py-4">
                            <div className="space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActivePath(item.path)
                                            ? 'text-indigo-600 bg-indigo-50'
                                            : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>

                            {user && (
                                <>
                                    <div className="h-px bg-gray-200 my-3" />
                                    <div className="space-y-1">
                                        {userMenuItems.map((item) => (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className="block px-4 py-3 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="h-[57px] md:h-[65px]" />
        </>
    )
}