import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import HeroImage from 'E:/Scoreflex/scoreflex/src/assets/hero-image.png'
import HeroDarkImage from '../assets/dark-hero-image.png'
import {
    Sparkles,
    Radio,
    MonitorSmartphone,
} from "lucide-react";
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';


//Cards Content
const features = [
    {
        title: "AI Powered",
        description:
            "Generate engaging quizzes instantly from any topic, prompt, or existing document.",
        link: "Try prompt generator",
        href: "#create-quiz",
        icon: "sparkles",
    },
    {
        title: "Real-time Play",
        description:
            "Live sync leaderboards, instant scoring streaks, and zero-latency multiplayer rooms.",
        link: "Host live lobby",
        href: "#host-setup",
        icon: "radio",
    },
    {
        title: "Any Device",
        description:
            "No app installs required. Join effortlessly on mobile, tablet, or desktop via code or QR.",
        link: "View player experience",
        href: "#join-quiz",
        icon: "devices",
    },
];


const featureIcons = {
    "AI Powered": Sparkles,
    "Real-time Play": Radio,
    "Any Device": MonitorSmartphone,
};

export default function Home() {
    const { theme, changeTheme, mode } = useTheme();
    return (
        <>
            <Navbar />
            <section
                className="w-full mx-0 md:px-12"
                style={{
                    backgroundColor: theme.backgroundColor,
                    color: theme.color,
                }}
            >
                <div
                    className="
      mx-auto grid w-full max-w-7xl grid-cols-1
      items-center gap-8 px-4 py-12
      sm:px-6 sm:py-16
      lg:min-h-165 lg:grid-cols-2
      lg:gap-12 lg:px-8 lg:py-12
      xl:gap-16
    "
                >
                    <div
                        className="
        mx-auto flex w-full max-w-2xl min-w-0
        flex-col items-center gap-5 text-center
        lg:mx-0 lg:items-start lg:text-left
      "
                    >
                        <span
                            className={` ${mode == 'light' ? 'bg-blue-100' : 'bg-[#414648] text-white'}
          inline-flex max-w-full items-center justify-center
          gap-2 self-center rounded-full
       px-3 py-2
          font-semibold leading-tight text-[#101C32]
          sm:px-4
          lg:self-start 
        `}
                        >
                            <span
                                className="h-2 w-2 shrink-0 rounded-full bg-[#2850E8]"
                                aria-hidden="true"
                            />

                            <span className="text-[11px] lg:text-[12px] md:text-[14px]">
                                NEXT-GEN LIVE KNOWLEDGE TESTING HUB
                            </span>
                        </span>

                        <h1
                            className="
          text-balance text-4xl font-extrabold
          leading-[1.12] tracking-tight
          sm:text-5xl xl:text-6xl
        "
                            style={{ color: theme.color }}
                        >
                            Turn your ideas into{" "}
                            <span className="bg-linear-to-r from-[#2850E8] to-[#6545D8] bg-clip-text text-transparent">
                                interactive quizzes
                            </span>
                        </h1>

                        <p
                            className="max-w-xl text-base leading-7 sm:text-lg"
                            style={{
                                color: theme.color,
                            }}
                        >
                            Create, host and play quizzes with friends, colleagues,
                            or your global community. It's fast, beautifully
                            responsive, and designed for pure engagement.
                        </p>

                        <div
                            className="
          mt-2 flex w-full flex-wrap items-center
          justify-center gap-3
          lg:justify-start
        "
                        >
                            <a
                                href="/join"
                                className="
            inline-flex items-center justify-center gap-2
            rounded-xl bg-[#2850E8] px-5 py-3
            text-sm font-semibold text-white
            shadow-sm transition-all duration-200
            hover:-translate-y-0.5 hover:bg-[#2043CC]
            hover:shadow-md
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-blue-500
            focus-visible:ring-offset-2
            motion-reduce:transform-none
            motion-reduce:transition-none
          "
                            >
                                Join Quiz

                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>

                            <Link
                                to="/host"
                                className="
            inline-flex items-center justify-center
            rounded-xl border border-slate-300
            px-5 py-3 text-sm font-semibold
            transition-colors duration-200
            hover:bg-slate-100
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-blue-500
            focus-visible:ring-offset-2
            dark:border-slate-600 dark:hover:bg-slate-800 hover:text-white
          "
                            // style={{ color: theme.color }}
                            >
                                Create the Quiz
                            </Link>
                        </div>
                    </div>

                    <div
                        className="
        flex w-full min-w-0 items-center
        justify-center lg:justify-end
      "
                    >
                        <div
                            className="
          relative isolate h-75 w-full max-w-140
          sm:h-95
          lg:h-120
        "
                        >
                            <div
                                aria-hidden="true"
                                className="
            pointer-events-none absolute inset-[12%]
            -z-10 rounded-full bg-blue-500/5 blur-3xl
          "
                            />

                            <img
                                src={theme.mode === "light" ? HeroImage : HeroDarkImage}
                                alt="Preview of a live ScoreFlex quiz"
                                className="
            absolute inset-0 block h-full w-full
            object-contain object-center
          "
                                draggable={false}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section
                className={`py-10 sm:py-12 ${mode == 'light' ? 'bg-[#eff4ff]' : 'bg-[#414648]'}`}
                aria-label="Platform features"
            >
                <div className="mx-auto max-w-6xl px-4 ">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                        {features.map((feature) => {
                            const Icon = featureIcons[feature.title] || Sparkles;

                            return (
                                <div
                                    key={feature.title}
                                    className="
              group flex h-full items-start text-start gap-6
              rounded-2xl
               px-8 py-10
              shadow-[0_1px_3px_rgba(15,23,42,0.04)]
              transition-all duration-300 ease-out
              hover:-translate-y-1
              bg-white 
              hover:shadow-[0_10px_28px_-10px_rgba(37,99,235,0.18)]
              motion-reduce:transform-none
              motion-reduce:transition-none
            " style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
                                >
                                    {/* Icon container */}
                                    <div
                                        className="
                flex h-12 w-12 shrink-0 items-center justify-center
                rounded-2xl bg-[#e7efff] text-[#244de6]
                transition-colors duration-300
                group-hover:bg-[#244de6]
                group-hover:text-white
                dark:bg-blue-200 dark:text-indigo-500
                dark:group-hover:bg-blue-600
                dark:group-hover:text-white
              "
                                    >
                                        <Icon
                                            size={21}
                                            strokeWidth={1.9}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    {/* Card content */}
                                    <div className="min-w-0 flex-1">
                                        <h3
                                            className="
                  text-lg font-semibold leading-6
                  tracking-tight text-slate-950
                  dark:text-white
                "
                                            style={{ color: theme.color }}
                                        >
                                            {feature.title}
                                        </h3>

                                        <p
                                            className="
                  mt-1 text-sm leading-5
                  text-slate-700 dark:text-slate-300
                "
                                            style={{ color: theme.color }}
                                        >
                                            {feature.description}
                                        </p>

                                        {/* {feature.link && feature.href && (
                      <a
                        href={feature.href}
                        className="
                    mt-2 inline-flex items-center gap-1
                    text-xs font-medium text-blue-700
                    transition-colors duration-200
                    hover:text-blue-900
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-blue-500
                    focus-visible:ring-offset-2
                    dark:text-blue-400
                    dark:hover:text-blue-300
                  "
                      >
                        {feature.link}
                        <ArrowRight
                          size={14}
                          strokeWidth={1.8}
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </a>
                    )} */}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

