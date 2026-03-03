import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";

import { InstallPrompt } from "../components/InstallPrompt";



const LayoutInner = () => {
    const { pathname } = useLocation();

    const hideLayout =
        pathname === "/login" ||
        pathname === "/register";

    return (
        <main className="text-gray-700">
            {/* {!hideLayout && <Navbar />} */}
            <Outlet />
            <InstallPrompt />
        </main>
    );
};

export const Root = () => {
    return <LayoutInner />

};