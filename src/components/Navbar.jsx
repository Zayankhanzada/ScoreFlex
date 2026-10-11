import { useState } from "react";
import favicon from "/favicon.png";

export default function Navbar() {
    const [theme, setTheme] = useState({
        mode: "light",
        color: "#1E293B",
        backgroundColor: "#F8FAFC",
    });

    const [profileOpen, setProfileOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    const changeTheme = () => {
        setTheme((prev) =>
            prev.mode === "light"
                ? {
                    mode: "dark",
                    color: "#F1F5F9",
                    backgroundColor: "#353839",
                }
                : {
                    mode: "light",
                    color: "#1E293B",
                    backgroundColor: "#F8FAFC",
                }
        );
    };

    const isDark = theme.mode === "dark";

    const profileButton = (
        <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{
                color: theme.color,
                backgroundColor: isDark ? "#475569" : "#E5E7EB",
            }}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
            >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
        </button>
    );

    const profileDropdown = profileOpen && (
        <div
            className="absolute right-0 top-full z-50 mt-2 w-40 rounded-lg border py-1 shadow-lg"
            style={{
                color: theme.color,
                backgroundColor: theme.backgroundColor,
                borderColor: isDark ? "#475569" : "#E2E8F0",
            }}
        >
            <button
                type="button"
                onClick={() => {
                    setLoggedIn((prev) => !prev);
                    setProfileOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm hover:opacity-70"
            >
                {loggedIn ? "Logout" : "Login"}
            </button>
        </div>
    );

    return (
        <nav
            className="relative flex items-center justify-between border-b px-4 py-3 sm:px-6"
            style={{
                color: theme.color,
                backgroundColor: theme.backgroundColor,
                borderColor: isDark ? "#475569" : "#E2E8F0",
            }}
        >
            {/* Logo */}
            <a href="/" className="flex items-center gap-1 text-xl font-bold">
                <img src={favicon} alt="ScoreFlex logo" className="w-10" />
                ScoreFlex
            </a>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-6 sm:flex">
                <a href="/about" className="text-sm font-medium hover:opacity-70">
                    About Us
                </a>

                <button
                    type="button"
                    onClick={changeTheme}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    className="rounded-full p-2 hover:opacity-70"
                >
                    {isDark ? "☀️" : "🌙"}
                </button>

                <div className="relative">
                    {profileButton}
                    {profileDropdown}
                </div>
            </div>

            {/* Mobile actions: avatar + hamburger */}
            <div className="flex items-center gap-2 sm:hidden">
                <div className="relative">
                    {profileButton}
                    {profileDropdown}
                </div>

                <button
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-expanded={menuOpen}
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    className="rounded-md p-2 hover:opacity-70"
                >
                    {menuOpen ? (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-6 w-6"
                            aria-hidden="true"
                        >
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-6 w-6"
                            aria-hidden="true"
                        >
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile menu: About Us + theme only */}
            {menuOpen && (
                <div
                    className="absolute left-0 right-0 top-full z-40 flex flex-col gap-1 border-b p-4 shadow-lg sm:hidden"
                    style={{
                        color: theme.color,
                        backgroundColor: theme.backgroundColor,
                        borderColor: isDark ? "#475569" : "#E2E8F0",
                    }}
                >
                    <a
                        href="/about"
                        onClick={() => setMenuOpen(false)}
                        className="rounded-md px-3 py-2 text-sm font-medium hover:opacity-70"
                    >
                        About Us
                    </a>

                    <button
                        type="button"
                        onClick={changeTheme}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:opacity-70"
                    >
                        <span>{isDark ? "☀️" : "🌙"}</span>
                        {isDark ? "Light mode" : "Dark mode"}
                    </button>
                </div>
            )}
        </nav>
    );
}