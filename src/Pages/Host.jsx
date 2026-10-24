import { useState } from "react"
import { Link } from "react-router-dom"
import { House, Sparkles, SquarePen, CircleCheck, Zap, SlidersHorizontal } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"


export default function Host() {
  const { theme, changeTheme, mode } = useTheme();
  const [selectedMode, setSelectedMode] = useState("ai");
  return (
    <>
      <Navbar />
      <section className="" style={{ backgroundColor: theme.backgroundColor }}>
        <div className="container mx-auto py-8 lg:pt-12 lg:pb-8">
          <div className="Paging text-start gap-5 px-5 lg:px-35   ">
            <h6 className="inline-flex items-center gap-1"> <Link to="/" className="hover:text-blue-600"> <House /> </Link> {" > "}  Host Setup </h6>
          </div>

          <div className=" px-5 lg:px-35  mt-10 text-start">
            <h2 className="font-extrabold text-start lg:text-[40px]" style={{ color: theme.color }}> Create A Quiz</h2>
            <p className="">  Choose how you want to create your quiz  </p>
          </div>
        </div>
      </section>
      <section className="" style={{ backgroundColor: theme.backgroundColor }}>
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="mx-auto grid max-w-6xl items-center grid-cols-1 gap-5 lg:grid-cols-2">
            <button
              type="button"
              onClick={() => setSelectedMode("ai")}
              aria-pressed={selectedMode === "ai"}
              className={`group relative isolate flex min-h-72 flex-col overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 sm:p-8 ${selectedMode === "ai"
                ? "border-blue-600 shadow-md shadow-blue-600/5 dark:border-blue-400  "
                : " shadow-sm hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg  dark:hover:border-slate-300"
                } ${mode == 'light' ? 'bg-white hover:bg-blue-100 border-slate-200 ' : 'bg-[#414648]'}`} style={{ color: theme.color }}
            >
              {selectedMode === "ai" && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-12 -right-10 -z-10 size-40 rounded-full bg-indigo-50 dark:bg-blue-500/5"
                />
              )}

              <div className="flex w-full items-start justify-between gap-4">
                <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white  transition-colors  dark:bg-blue-600 " >
                  <Sparkles size={28} />
                </span>

                {selectedMode === "ai" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-sm font-medium text-white dark:bg-blue-600">
                    <CircleCheck size={16} />
                    Selected
                  </span>
                ) : (
                  <span className="rounded-full px-2 py-1 text-sm"  >
                    AI Engine
                  </span>
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold tracking-tight sm:text-2xl mb-3" style={{ color: theme.color }}>
                  ScoreFlex Engine Generated Quiz
                </h3>

                <p className={`mt-2 text-base leading-7 ${mode == 'light' ? 'text-slate-500' : 'text-slate-200'}`}>
                  Let ScoreFlex Engine craft questions, realistic distractors, and concise
                  explanations in seconds from any topic.
                </p>
              </div>

              <div
                className={`mt-6 flex items-center gap-2 text-sm font-medium sm:text-base ${selectedMode === "ai"
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-slate-700 dark:text-slate-300"
                  }`}
              >
                <Zap size={20} />
                <span>Speed: ~4.2 seconds</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMode("custom")}
              aria-pressed={selectedMode === "custom"}
              className={`group relative isolate flex min-h-72 flex-col overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 sm:p-8 ${selectedMode === "custom"
                ? "border-blue-600 shadow-md shadow-blue-600/5 dark:border-blue-400"
                : "shadow-sm hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:hover:border-slate-300"
                } ${mode == "light"
                  ? "bg-white hover:bg-blue-100 border-slate-200"
                  : "bg-[#414648]"
                }`}
              style={{ color: theme.color }}
            >
              {selectedMode === "custom" && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-12 -right-10 -z-10 size-40 rounded-full bg-indigo-50 dark:bg-blue-500/5"
                />
              )}

              <div className="flex w-full items-start justify-between gap-4">
                <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white transition-colors">
                  <SquarePen size={28} />
                </span>

                {selectedMode === "custom" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-sm font-medium text-white dark:bg-blue-600">
                    <CircleCheck size={16} />
                    Selected
                  </span>
                ) : (
                  <span className="rounded-full px-2 py-1 text-sm">
                    Manual Authoring
                  </span>
                )}
              </div>

              <div className="mt-6">
                <h3
                  className="mb-3 text-xl font-semibold tracking-tight sm:text-2xl"
                  style={{ color: theme.color }}
                >
                  Custom Quiz
                </h3>

                <p className={`mt-2 text-base leading-7 ${mode == 'light' ? 'text-slate-500' : 'text-slate-200'}`}>
                  Build your own quiz with full control. Add multiple-choice
                  options, time limits, and custom media.
                </p>
              </div>

              <div
                className={`mt-6 flex items-center gap-2 text-sm font-medium sm:text-base ${selectedMode === "custom"
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-slate-700 dark:text-slate-300"
                  }`}
              >
                <SlidersHorizontal size={20} />
                <span> Granular Authoring</span>
              </div>
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
