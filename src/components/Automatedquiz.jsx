import { memo, useCallback, useId, useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";

/* ---------- Static config (outside component = no re-creation per render) ---------- */

const MAX_TITLE_LENGTH = 60;
const MAX_TOPIC_LENGTH = 80;

const SUGGESTED_TOPICS = [
    "General Knowledge",
    "Science & Nature",
    "Tech & Coding",
    "World History",
    "Pop Culture",

];

const QUESTION_OPTIONS = [
    { value: 5, label: "5", duration: "3 to 5" },
    { value: 10, label: "10", duration: "7 to 10" },
    { value: 15, label: "15", duration: "10 to 15" },
    { value: 20, label: "20", duration: "14 to 20" },
];

const DIFFICULTY_OPTIONS = [
    { value: "easy", label: "Easy", points: "50-100" },
    { value: "medium", label: "Medium", points: "100-150" },
    { value: "hard", label: "Hard", points: "150-250" },
];

/* ---------- Small reusable pieces ---------- */

const Chip = memo(function Chip({ label, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`rounded-full px-4 py-1.5 shadow-md  font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:text-[15px] ${active
                    ? "bg-blue-700 font-semibold text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
        >
            {label}
        </button>
    );
});

/** Labeled text input with a live character counter. */
const CounterInput = memo(function CounterInput({
    label,
    value,
    max,
    placeholder,
    onChange,
}) {
    const id = useId();
    return (
        <div>
            <label htmlFor={id} className="text-sm font-semibold text-slate-900">
                {label}
            </label>
            <div className="relative mt-2">
                <input
                    id={id}
                    type="text"
                    value={value}
                    maxLength={max}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-xl bg-indigo-50 py-3.5 pl-4 pr-16 text-base text-slate-800 outline-none ring-1 ring-transparent transition placeholder:text-slate-400 focus:bg-white focus:ring-blue-600"
                />
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500"
                >
                    {value.length}/{max}
                </span>
            </div>
        </div>
    );
});

/** Accessible segmented control (radio group semantics). */
const SegmentedControl = memo(function SegmentedControl({
    label,
    options,
    value,
    onChange,
}) {
    const groupId = useId();

    return (
        <div
            role="radiogroup"
            aria-labelledby={groupId}
            className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-indigo-50 p-1"
        >
            <span id={groupId} className="sr-only">
                {label}
            </span>
            {options.map((opt) => {
                const active = opt.value === value;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => onChange(opt.value)}
                        className={`rounded-lg px-2 py-2.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${active
                                ? "bg-blue-700 font-semibold text-white shadow-sm"
                                : "text-slate-600 hover:bg-indigo-100"
                            }`}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
});

const BrainIcon = () => (
    <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
        <path d="M10 21h4M12 8v4M10 10h4" />
    </svg>
);

const SlidersIcon = () => (
    <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <path d="M4 7h10M18 7h2M4 12h4M12 12h8M4 17h12" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="10" cy="12" r="2" />
        <circle cx="18" cy="17" r="2" />
    </svg>
);

/* ---------- Main component ---------- */

export default function AutomatedQuiz({
    initialValues,
    onChange,
}) {
    const [settings, setSettings] = useState({
        title: "",
        topic: "",
        questions: 10,
        difficulty: "medium",
        ...initialValues,
    });

    // Single updater keeps the parent in sync without extra effects.
    const update = useCallback(
        (patch) => {
            setSettings((prev) => {
                const next = { ...prev, ...patch };
                onChange?.(next);
                return next;
            });
        },
        [onChange]
    );
    const { theme, mode } = useTheme();
    const setTitle = useCallback((title) => update({ title }), [update]);
    const setTopic = useCallback((topic) => update({ topic }), [update]);
    const setQuestions = useCallback((questions) => update({ questions }), [update]);
    const setDifficulty = useCallback((difficulty) => update({ difficulty }), [update]);

    const duration = useMemo(
        () => QUESTION_OPTIONS.find((o) => o.value === settings.questions)?.duration,
        [settings.questions]
    );
    const points = useMemo(
        () => DIFFICULTY_OPTIONS.find((o) => o.value === settings.difficulty)?.points,
        [settings.difficulty]
    );

    return (
        <section
            aria-labelledby="quick-settings-heading"
            className="mx-auto w-full max-w-7xl rounded-2xl p-4 shadow-xl ring-1 ring-slate-100 sm:p-6 lg:p-8"
            style={{ backgroundColor: theme.backgroundColor }}>
            {/* Header */}
            <header className="text-center">
                <div className="min-w-0">
                    <h2
                        id="quick-settings-heading"
                        className="text-xl font-bold text-slate-900 sm:text-2xl"
                    >
                        Quick Settings
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Configure Rules before launching the room generator.
                    </p>
                </div>
            </header>

            {/* Title + Topic */}
            <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6">
                <CounterInput
                    label="Quiz Title"
                    value={settings.title}
                    max={MAX_TITLE_LENGTH}
                    placeholder="e.g. John's Quiz"
                    onChange={setTitle}
                />
                <CounterInput
                    label="Quiz Is About"
                    value={settings.topic}
                    max={MAX_TOPIC_LENGTH}
                    placeholder="e.g. World capitals"
                    onChange={setTopic}
                />
            </div>

            {/* Suggested topics */}
            <div className="mt-6">
                <span className=" font-medium text-slate-800">Popular Topics</span>
                <div className="mt-2 flex items-center justify-center flex-wrap gap-2">
                    {SUGGESTED_TOPICS.map((topic) => (
                        <Chip
                            key={topic}
                            label={topic}
                            active={settings.topic === topic}
                            onClick={() => setTopic(topic)}
                            className="text-[16px]"
                        />
                    ))}
                </div>
            </div>

            {/* Questions + Difficulty */}
            <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-8">
                <div>
                    <span className="text-sm font-semibold text-slate-900">
                        Number of Questions
                    </span>
                    <div className="my-2">
                        <SegmentedControl
                            label="Number of questions"
                            options={QUESTION_OPTIONS}
                            value={settings.questions}
                            onChange={setQuestions}
                        />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                        Estimated play duration: {duration} minutes
                    </p>
                </div>

                <div>
                    <span className="text-sm font-semibold text-slate-900 mb-3">
                        Difficulty Level
                    </span>
                    <div className="my-2">
                        <SegmentedControl
                            label="Difficulty level"
                            options={DIFFICULTY_OPTIONS}
                            value={settings.difficulty}
                            onChange={setDifficulty}
                        />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                        Adaptive scoring: {points} pts / Question
                    </p>
                </div>
            </div>

            {/* AI preset banner */}
            <div className="mt-6 flex flex-col gap-3 rounded-xl bg-indigo-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-blue-700">
                        <BrainIcon />
                    </div>
                    <div className="min-w-0">
                        <p className="text-start font-semibold text-slate-900">AI Preset Active</p>
                        <p className="text-sm text-slate-600">
                            Includes explanations, 30s timers.
                        </p>
                    </div>
                </div>
                <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-900">
                    <SlidersIcon />
                    Strict Moderation On
                </span>
            </div>
        </section>
    );
}