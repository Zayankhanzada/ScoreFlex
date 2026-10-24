import { useTheme } from "../context/ThemeContext";
import favicon from "/favicon.png";


const platformLinks = [
    { label: "Play Quiz", href: "/join" },
    { label: "Host Room", href: "/host" },
    { label: "Leaderboard", href: "/leaderboard" },
];

const communityLinks = [
    { label: "Documentation", href: "/docs" },
    { label: "Support Desk", href: "/support" },
    { label: "Server Status", href: "/status", status: true },
];

function FooterLinks({ title, links }) {
    const { theme, changeTheme } = useTheme()
    return (
        <nav aria-label={title}>
            <h2 className="text-sm font-semibold  tracking-wide" style={{ color: theme.color }}>
                {title}
            </h2>

            <ul className="mt-3 space-y-2.5">
                {links.map(({ label, href }) => (
                    <li key={label}>
                        <a
                            href={href}
                            className="inline-flex items-center gap-2 text-sm text-slate-900 transition-colors duration-200 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            style={{ color: theme.color }}>
                            {label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { theme, changeTheme, mode } = useTheme();
    return (
        <footer className={` border-t ${mode == "light" ? "bg-white border-transparent":"bg-[#414648] border-[#2d3132]" }`} style={{ color: theme.color }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main footer */}
                <div
                    className="
            grid grid-cols-1 gap-8 py-8
            md:grid-cols-2 md:gap-x-12
            lg:grid-cols-[minmax(0,1.7fr)_minmax(140px,0.7fr)_minmax(160px,0.8fr)]
            lg:gap-10 lg:py-10
          "
                >
                    <div className="min-w-0 text-center md:col-span-2 lg:col-span-1 lg:text-left">
                        <a
                            href="/"
                            className="mb-4 flex items-center justify-center gap-2 text-xl font-bold lg:justify-start  md:justify-center"
                        >
                            <img
                                src={favicon}
                                alt="ScoreFlex logo"
                                className="h-10 w-10 object-contain"
                            />
                            ScoreFlex
                        </a>

                        <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-slate-400 sm:text-base lg:mx-0 lg:text-left">
                            Real-time interactive quizzes, live rankings, and smart room multiplayer.
                        </p>
                    </div>


                    <FooterLinks title="Platform" links={platformLinks} />
                    <FooterLinks title="Community" links={communityLinks} />
                </div>

                {/* Footer bottom bar */}
                <div
                    className="
            flex flex-col gap-4 border-t border-slate-200
            py-5 text-sm
            md:flex-row md:items-center
            md:justify-between md:gap-6
          "
                >
                    <p className="text-slate-400 lg:text-[14px] text-[12px]">
                        © {currentYear} ScoreFlex Inc. All rights reserved.
                    </p>

                    <div
                        className={`${mode == 'light' ? 'bg-blue-50' : 'bg-[#414648]'} inline-flex w-fit max-w-full items-center gap-1 rounded-full px-3 py-2 text-[14px] font-medium sm:text-sm`}
            
                        style={{ color: theme.color }}  >
                        <span
                            aria-hidden="true"
                            className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-600"
                        />

                        <span className="text-[12px] lg:text-[14px]" style={{ color: theme.color }} >
                            Score Engine v0.1
                            <span className="mx-1.5">•</span>
                            All Systems Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}