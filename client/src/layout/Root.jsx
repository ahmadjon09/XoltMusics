import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useMusic } from "../context/MusicContext";
import { MusicPlayer } from "../components/MusicPlayer";
import { InstallPrompt } from "../components/InstallPrompt";

const MusicPlayerWrapper = () => {
    const { currentTrack } = useMusic();
    if (!currentTrack) return null;
    return <MusicPlayer />;
};

const LayoutInner = () => {
    const { pathname } = useLocation();

    const hideLayout =
        pathname === "/login" ||
        pathname === "/register";

    return (
        <main className="text-gray-700">
            {!hideLayout && <Navbar />}
            <Outlet />
            <InstallPrompt />
            {!hideLayout && <MusicPlayerWrapper />}
        </main>
    );
};

export const Root = () => {
    return <LayoutInner />

};