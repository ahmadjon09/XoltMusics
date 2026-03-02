import { useEffect, useState } from "react";
import { useTranslation } from "../hooks/UseLanguage";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, ArrowDown } from "lucide-react";

export const InstallPrompt = () => {
    const { t } = useTranslation();
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [show, setShow] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Check if already installed or dismissed
        const dismissed = localStorage.getItem("installPromptDismissed");
        if (dismissed === "true") {
            setIsDismissed(true);
            return;
        }

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Don't show immediately, wait a bit
            setTimeout(() => {
                const dismissed = localStorage.getItem("installPromptDismissed");
                if (!dismissed) {
                    setShow(true);
                }
            }, 3000);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                localStorage.setItem("installPromptDismissed", "true");
            }
        } catch (error) {
            console.error('Error installing app:', error);
        }

        setShow(false);
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShow(false);
        setIsDismissed(true);
        localStorage.setItem("installPromptDismissed", "true");
    };

    if (!show || isDismissed) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50"
            >
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />

                    {/* Content */}
                    <div className="relative p-4">
                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="Dismiss"
                        >
                            <X className="w-4 h-4 text-white/80 hover:text-white" />
                        </button>

                        {/* Main content */}
                        <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                    <Smartphone className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            {/* Text and button */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-semibold text-sm mb-0.5">
                                    {t('installApp') || "Install App"}
                                </h4>
                                <p className="text-white/80 text-xs mb-2 line-clamp-2">
                                    {t('installDescription') || "Install XoltMusic on your device for quick access"}
                                </p>

                                {/* Install button */}
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        onClick={handleInstall}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 bg-white text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1"
                                    >
                                        <Download className="w-3 h-3" />
                                        <span>{t('install') || "Install"}</span>
                                    </motion.button>

                                    {/* Animated arrow for attention */}
                                    <motion.div
                                        animate={{ y: [0, 4, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="text-white/60"
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress bar animation */}
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-1 bg-white/30"
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};