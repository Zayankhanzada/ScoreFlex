import Navbar from './components/Navbar';
import { useTheme } from './context/ThemeContext';
import HeroImage from 'E:/Scoreflex/scoreflex/src/assets/hero-image.png'
import HeroDarkImage from '../src/assets/dark-hero-image.png'
import {
  Sparkles,
  Radio,
  MonitorSmartphone,
  ArrowRight,
} from "lucide-react";

import './App.css';


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

function App() {
  const { theme, changeTheme } = useTheme();
  return (
    <>
      <Navbar />
      <section className="bg-white dark:bg-gray-900" style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>
        <div className="flex lg:flex-row flex-col items-center justify-between max-w-7xl px-6 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-0 lg:grid-cols-12">

          <div className=" col-span-12 lg:col-span-7 mx-auto flex flex-col text-center lg:text-start gap-4 mt-0">
            <span className="inline-flex w-fit max-w-full items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-[14px] font-semibold leading-tight text-[#101C32] sm:px-4 sm:py-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#2850E8]" />
              <span className="min-w-0">
                NEXT-GEN LIVE KNOWLEDGE TESTING HUB
              </span>
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl xl:text-6xl mt-0" style={{ color: theme.color }}>Turn your ideas into
              <span className='bg-linear-to-r from-[#2850E8] to-[#6545D8] bg-clip-text text-transparent'> interactive quizzes </span></h1>
            <p className="font-light text-gray-500  md:text-lg  dark:text-gray-400 text-[14px]" style={{ color: theme.color }}>Create, host and play quizzes with friends, colleagues, or your global community. It's fast, beautifully responsive, and designed for pure engagement.</p>
            <div className='mt-4'>
              <a href="#" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900" style={{ color: theme.color }}>
                Join Quiz
                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </a>
              <a href="#" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800" style={{ color: theme.color }}>
                Create the Quiz
              </a>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5">

            <img src={theme.mode == "light" ? HeroImage : HeroDarkImage} alt="quiz" className='' />
          </div>
        </div>
      </section>

      <section
        className="py-10 sm:py-12"
        style={{ backgroundColor: theme.backgroundColor }}
        aria-label="Quiz platform features"
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
              rounded-2xl border border-white-200
               px-6 py-10
              shadow-[0_1px_3px_rgba(15,23,42,0.04)]
              transition-all duration-300 ease-out
              hover:-translate-y-1
              hover:border-blue-200
              hover:shadow-[0_10px_28px_-10px_rgba(37,99,235,0.18)]
              motion-reduce:transform-none
              motion-reduce:transition-none
            "
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
    </>
  )
}

export default App
