import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

/* -------------------------------------------------------------------------- */
/* Configuration and helpers                                                  */
/* -------------------------------------------------------------------------- */

const LIMITS = {
  name: 60,
  question: 300,
  option: 100,
  explanation: 300,
  maxQuestions: 50,
};

const OPTION_LABELS = ["A", "B", "C", "D"];

let idCounter = 0;
const createQuestion = () => ({
  id: `manual-q-${Date.now()}-${++idCounter}`,
  text: "",
  options: OPTION_LABELS.map(() => ({ text: "", correct: false })),
  explanation: "",
});

const norm = (value) => value.trim().toLowerCase().replace(/\s+/g, " ");

/** Pure validation: returns an error object per question. */
function validateQuiz(name, questions) {
  const result = { name: null, questions: {}, count: 0 };

  if (!name.trim()) result.name = "Quiz name is required.";
  else if (name.trim().length < 3) {
    result.name = "Quiz name must be at least 3 characters.";
  }
  if (result.name) result.count += 1;

  const seenQuestions = new Set();

  questions.forEach((question) => {
    const errors = {
      text: null,
      options: [null, null, null, null],
      optionsCount: null,
      correct: null,
    };

    const questionText = norm(question.text);
    if (!questionText) errors.text = "Question text is required.";
    else if (questionText.length < 5) {
      errors.text = "Question must be at least 5 characters.";
    } else if (seenQuestions.has(questionText)) {
      errors.text = "This question is a duplicate of an earlier one.";
    }
    if (questionText) seenQuestions.add(questionText);

    // Blank options are allowed. Only entered options are checked for duplicates.
    const filledOptions = question.options
      .map((option) => norm(option.text))
      .filter(Boolean);

    if (filledOptions.length < 2) {
      errors.optionsCount = "Enter at least two answer options. The remaining options are optional.";
    }

    const seenOptions = new Set();
    question.options.forEach((option, index) => {
      const optionText = norm(option.text);
      if (!optionText) return;

      if (seenOptions.has(optionText)) {
        errors.options[index] = "Options must be unique.";
      }
      seenOptions.add(optionText);
    });

    // A correct answer must belong to an option that contains text.
    if (!question.options.some((option) => option.text.trim() && option.correct)) {
      errors.correct = "Select at least one filled option as a correct answer.";
    }

    result.count +=
      Number(Boolean(errors.text)) +
      errors.options.filter(Boolean).length +
      Number(Boolean(errors.optionsCount)) +
      Number(Boolean(errors.correct));
    result.questions[question.id] = errors;
  });

  return result;
}

const FieldError = memo(function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[11px] font-medium text-rose-500 sm:text-xs">
      {message}
    </p>
  );
});

const ChevronLeft = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
    <path d="m12.5 4.5-5 5.5 5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
    <path d="m7.5 4.5 5 5.5-5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/* One question editor. Only the active slide is rendered.                    */
/* -------------------------------------------------------------------------- */

const QuestionCard = memo(function QuestionCard({
  question,
  index,
  errors,
  submitted,
  canRemove,
  autoFocus,
  mode,
  theme,
  touched,
  onTouch,
  onChange,
  onRemove,
}) {
  const uid = useId();
  const isDark = mode === "dark";

  const panelClass = isDark
    ? "border border-[#53606a] bg-[#30383d] text-slate-100"
    : "border border-indigo-100 bg-white text-slate-800 shadow-sm";

  const fieldClass = isDark
    ? "bg-[#222a30] text-slate-100 placeholder:text-slate-400 ring-white/10 focus:ring-blue-500"
    : "bg-indigo-50 text-slate-800 placeholder:text-slate-400 ring-indigo-100 focus:bg-white focus:ring-blue-600";

  const handleText = (event) => onChange(question.id, { text: event.target.value });
  const handleExplanation = (event) =>
    onChange(question.id, { explanation: event.target.value });

  const handleOption = (optionIndex, patch) => {
    const options = question.options.map((option, currentIndex) => {
      if (currentIndex !== optionIndex) return option;

      const nextOption = { ...option, ...patch };
      // An empty option cannot remain selected as a correct answer.
      if (!nextOption.text.trim()) nextOption.correct = false;
      return nextOption;
    });
    onChange(question.id, { options });
  };

  const show = (key) => submitted || Boolean(touched[key]);
  const textError = show("text") ? errors.text : null;
  const optionsCountError = show("optionsCount") ? errors.optionsCount : null;
  const correctError = show("correct") ? errors.correct : null;
  const filledOptionCount = question.options.filter((option) => option.text.trim()).length;
  const firstEmptyOptionIndex = question.options.findIndex((option) => !option.text.trim());
  const fieldsetDescription = [
    optionsCountError ? `${uid}-options-count-error` : null,
    correctError ? `${uid}-correct-error` : null,
  ].filter(Boolean).join(" ") || undefined;

  return (
    <article className={`rounded-2xl p-3 sm:p-5 lg:p-6 ${panelClass}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-sm font-bold text-blue-500">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-sm font-bold sm:text-base" style={{ color: theme.color }}>
              Question {index + 1}
            </h3>
            <p className={`text-[11px] sm:text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Add the question and select its correct answer
            </p>
          </div>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(question.id)}
            aria-label={`Remove question ${index + 1}`}
            className="rounded-lg px-2.5 py-2 text-[11px] font-semibold text-rose-500 sm:px-3 sm:text-xs transition hover:bg-rose-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            Remove question
          </button>
        )}
      </div>

      <label htmlFor={`${uid}-question`} className="mb-2 block text-xs font-semibold sm:text-sm" style={{ color: theme.color }}>
        Question text <span className="text-rose-500">*</span>
      </label>
      <textarea
        id={`${uid}-question`}
        autoFocus={autoFocus}
        value={question.text}
        maxLength={LIMITS.question}
        onChange={handleText}
        onBlur={() => onTouch(question.id, "text")}
        placeholder="Enter your question here..."
        aria-label={`Question ${index + 1} text`}
        aria-invalid={Boolean(textError)}
        aria-describedby={textError ? `${uid}-text-error` : undefined}
        className={`w-full resize-y rounded-xl px-4 py-3 text-sm outline-none ring-1 transition focus:ring-2 sm:min-h-32 ${fieldClass} ${textError ? "ring-rose-500 focus:ring-rose-500" : ""}`}
      />
      <div className="flex items-start justify-between gap-3">
        <FieldError id={`${uid}-text-error`} message={textError} />
        <span className={`ml-auto mt-1.5 shrink-0 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          {question.text.length}/{LIMITS.question}
        </span>
      </div>

      <fieldset className="mt-5 space-y-3" aria-describedby={fieldsetDescription}>
        <legend className="mb-2 w-full text-xs font-semibold sm:text-sm" style={{ color: theme.color }}>
          <span className="inline-flex flex-wrap items-center gap-2">
            Answer options <span className="text-rose-500">*</span>
            <span className={`text-[11px] sm:text-xs font-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Select one or more correct answers
            </span>
          </span>
        </legend>
        <p className={`-mt-1 text-[11px] sm:text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Fill at least two options. You can leave the others blank.
          <span className="ml-1">({filledOptionCount}/4 filled)</span>
        </p>

        {question.options.map((option, optionIndex) => {
          const key = `option-${optionIndex}`;
          const optionError = show(key) ? errors.options[optionIndex] : null;
          const needsMoreOptions = Boolean(
            optionsCountError && !option.text.trim() && optionIndex === firstEmptyOptionIndex
          );
          const optionFieldError = optionError || (needsMoreOptions ? optionsCountError : null);
          return (
            <div key={OPTION_LABELS[optionIndex]}>
              <div
                className={`flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 ring-1 transition focus-within:ring-2 sm:px-4 ${fieldClass} ${optionFieldError ? "ring-rose-500 focus-within:ring-rose-500" : ""}`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isDark ? "bg-[#3b4650] text-slate-200" : "bg-white text-slate-600"}`}>
                  {OPTION_LABELS[optionIndex]}
                </span>
                <input
                  type="text"
                  value={option.text}
                  maxLength={LIMITS.option}
                  onChange={(event) => handleOption(optionIndex, { text: event.target.value })}
                  onBlur={() => {
                    onTouch(question.id, key);
                    onTouch(question.id, "optionsCount");
                  }}
                  placeholder={`Enter option ${OPTION_LABELS[optionIndex]}`}
                  aria-label={`Option ${OPTION_LABELS[optionIndex]}`}
                  aria-invalid={Boolean(optionFieldError)}
                  aria-describedby={optionError
                    ? `${uid}-option-${optionIndex}-error`
                    : needsMoreOptions
                      ? `${uid}-options-count-error`
                      : undefined}
                  className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400 sm:text-sm"
                />
                <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs font-medium" style={{ color: theme.color }}>
                  <input
                    type="checkbox"
                    checked={option.correct}
                    disabled={!option.text.trim()}
                    onChange={(event) => {
                      onTouch(question.id, "correct");
                      handleOption(optionIndex, { correct: event.target.checked });
                    }}
                    aria-label={`Mark option ${OPTION_LABELS[optionIndex]} as correct`}
                    aria-invalid={Boolean(correctError && option.text.trim())}
                    aria-describedby={correctError ? `${uid}-correct-error` : undefined}
                    className="h-4 w-4 cursor-pointer accent-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                  />
                  <span className="text-[11px] sm:text-xs">Correct</span>
                </label>
              </div>
              <FieldError id={`${uid}-option-${optionIndex}-error`} message={optionError} />
            </div>
          );
        })}
        <FieldError id={`${uid}-options-count-error`} message={optionsCountError} />
        <FieldError id={`${uid}-correct-error`} message={correctError} />
      </fieldset>

      <div className="mt-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <label htmlFor={`${uid}-explanation`} className="text-xs font-semibold sm:text-sm" style={{ color: theme.color }}>
            Explanation <span className={`font-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}>(optional)</span>
          </label>
          <span className={`text-[11px] sm:text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {question.explanation.length}/{LIMITS.explanation}
          </span>
        </div>
        <textarea
          id={`${uid}-explanation`}
          value={question.explanation}
          maxLength={LIMITS.explanation}
          onChange={handleExplanation}
          placeholder="Explain why this answer is correct..."
          className={`min-h-20 w-full resize-y rounded-xl px-3 py-3 text-base outline-none sm:px-4 sm:text-sm ring-1 transition focus:ring-2 ${fieldClass}`}
        />
      </div>
    </article>
  );
});

/* -------------------------------------------------------------------------- */
/* Main component                                                              */
/* -------------------------------------------------------------------------- */

export default function ManualQuiz({ onSubmit }) {
  const { theme, mode } = useTheme();
  const isDark = mode === "dark";

  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [questions, setQuestions] = useState(() => [createQuestion()]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [touchedByQuestion, setTouchedByQuestion] = useState({});

  const formRef = useRef(null);
  const nameId = useId();

  const errors = useMemo(() => validateQuiz(name, questions), [name, questions]);
  const activeQuestion = questions[activeIndex];
  const atLimit = questions.length >= LIMITS.maxQuestions;
  const nameError = nameTouched || submitted ? errors.name : null;
  const activeErrors = errors.questions[activeQuestion?.id] || {
    text: null,
    options: [null, null, null, null],
    optionsCount: null,
    correct: null,
  };

  const updateQuestion = useCallback((id, patch) => {
    setQuestions((previous) =>
      previous.map((question) =>
        question.id === id ? { ...question, ...patch } : question
      )
    );
  }, []);

  const touchField = useCallback((questionId, field) => {
    setTouchedByQuestion((previous) => {
      const current = previous[questionId] || {};
      if (current[field]) return previous;
      return {
        ...previous,
        [questionId]: { ...current, [field]: true },
      };
    });
  }, []);

  const removeQuestion = useCallback((id) => {
    if (questions.length <= 1) return;

    const removedIndex = questions.findIndex((question) => question.id === id);
    if (removedIndex === -1) return;

    const nextQuestions = questions.filter((question) => question.id !== id);
    setQuestions(nextQuestions);
    setActiveIndex((current) => {
      if (current > removedIndex) return current - 1;
      if (current === removedIndex) return Math.min(removedIndex, nextQuestions.length - 1);
      return current;
    });
    setTouchedByQuestion((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
  }, [questions]);

  const addQuestion = useCallback(() => {
    if (questions.length >= LIMITS.maxQuestions) return;
    const newQuestion = createQuestion();
    setQuestions((previous) => [...previous, newQuestion]);
    setActiveIndex(questions.length);
  }, [questions.length]);

  const goToQuestion = useCallback((index) => {
    setActiveIndex(Math.max(0, Math.min(index, questions.length - 1)));
  }, [questions.length]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setNameTouched(true);

    if (errors.count > 0) {
      if (errors.name) {
        requestAnimationFrame(() => {
          formRef.current?.querySelector('[name="quiz-name"]')?.focus();
        });
        return;
      }

      const firstInvalidIndex = questions.findIndex((question) => {
        const questionErrors = errors.questions[question.id];
        return questionErrors && (
          questionErrors.text ||
          questionErrors.options.some(Boolean) ||
          questionErrors.optionsCount ||
          questionErrors.correct
        );
      });

      if (firstInvalidIndex >= 0) {
        setActiveIndex(firstInvalidIndex);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
          });
        });
      }
      return;
    }

    try {
      onSubmit?.({
        name: name.trim(),
        questions: questions.map((question) => {
          // Remove unused option fields and keep correct indexes aligned with
          // the compact options array sent to the existing onSubmit contract.
          const filledOptions = question.options.filter((option) => option.text.trim());

          return {
            text: question.text.trim(),
            options: filledOptions.map((option) => option.text.trim()),
            correct: filledOptions.flatMap((option, index) =>
              option.correct ? [index] : []
            ),
            explanation: question.explanation.trim(),
          };
        }),
      });
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  useEffect(() => {
    if (activeIndex > questions.length - 1) {
      setActiveIndex(Math.max(0, questions.length - 1));
    }
  }, [activeIndex, questions.length]);

  const completedQuestions = questions.filter((question) => {
    const questionErrors = errors.questions[question.id];
    return Boolean(
      question.text.trim() &&
      question.options.filter((option) => option.text.trim()).length >= 2 &&
      questionErrors &&
      !questionErrors.text &&
      !questionErrors.options.some(Boolean) &&
      !questionErrors.optionsCount &&
      !questionErrors.correct
    );
  }).length;

  const surfaceClass = isDark
    ? "border border-[#53606a] bg-[#414648]"
    : "border border-indigo-100 bg-[#eff4ff]";

  const mutedText = isDark ? "text-slate-300" : "text-slate-500";
  const softSurface = isDark ? "bg-[#30383d]" : "bg-white";
  const inactiveNav = isDark
    ? "border-[#5b6670] bg-[#30383d] text-slate-300 hover:border-blue-400 hover:text-white"
    : "border-indigo-100 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className={`mx-auto w-full max-w-7xl rounded-2xl p-3 shadow-xl sm:p-5 lg:p-8 ${surfaceClass}`}
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Header */}
      <header className="text-center">
        <h2 className="text-lg font-bold sm:text-xl lg:text-2xl" style={{ color: theme.color }}>
          Question Builder
        </h2>
        <p className={`mt-1 text-xs sm:text-sm ${mutedText}`}>
          Create your quiz manually, one question at a time.
        </p>
      </header>

      {/* Quiz name */}
      <div className="mt-6">
        <label htmlFor={nameId} className="text-xs font-semibold sm:text-sm" style={{ color: theme.color }}>
          Quiz Title <span className="text-rose-500">*</span>
        </label>
        <div className="relative mt-2">
          <input
            id={nameId}
            name="quiz-name"
            type="text"
            value={name}
            maxLength={LIMITS.name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => setNameTouched(true)}
            placeholder="e.g. John's Demo Quiz"
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? `${nameId}-error` : undefined}
            className={`w-full rounded-xl py-3 pl-3 pr-14 text-base outline-none ring-1 transition focus:ring-2 sm:py-3.5 sm:pl-4 sm:pr-16 sm:text-sm ${isDark
              ? "bg-[#222a30] text-white placeholder:text-slate-400 ring-white/10 focus:ring-blue-500"
              : "bg-white text-slate-800 placeholder:text-slate-400 ring-indigo-100 focus:ring-blue-600"
            } ${nameError ? "ring-rose-500 focus:ring-rose-500" : ""}`}
          />
          <span className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs ${mutedText}`}>
            {name.length}/{LIMITS.name}
          </span>
        </div>
        <FieldError id={`${nameId}-error`} message={nameError} />
      </div>

      {/* Question carousel controls */}
      <section className="mt-7" aria-label="Question navigation">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold sm:text-sm" style={{ color: theme.color }}>
              Your questions
            </h3>
            <p className={`mt-0.5 text-[11px] sm:text-xs ${mutedText}`}>
              {completedQuestions} of {questions.length} questions completed
            </p>
          </div>
          <span className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold sm:px-3 sm:text-xs ${isDark ? "bg-[#30383d] text-slate-200" : "bg-white text-slate-600"}`}>
            {questions.length} / {LIMITS.maxQuestions}
          </span>
        </div>

        {/* Numbered navigation; scrolls horizontally on narrow screens. */}
        <div className={`rounded-xl p-2 ${softSurface}`}>
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Choose a question">
            {questions.map((question, index) => {
              const questionErrors = errors.questions[question.id];
              const hasContent = Boolean(question.text.trim());
              const isComplete = Boolean(
                hasContent &&
                question.options.filter((option) => option.text.trim()).length >= 2 &&
                questionErrors &&
                !questionErrors.text &&
                !questionErrors.options.some(Boolean) &&
                !questionErrors.optionsCount &&
                !questionErrors.correct
              );
              const active = index === activeIndex;
              return (
                <button
                  key={question.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="manual-quiz-active-question"
                  onClick={() => goToQuestion(index)}
                  className={`relative flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg border px-2.5 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:h-10 sm:min-w-10 sm:px-3 sm:text-sm ${active
                    ? "border-blue-600 bg-blue-700 text-white shadow-md shadow-blue-700/20"
                    : isComplete
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                      : inactiveNav
                  }`}
                  aria-label={`Go to question ${index + 1}${isComplete ? ", completed" : ""}`}
                >
                  {index + 1}
                  {submitted && questionErrors && (
                    (questionErrors.text || questionErrors.options.some(Boolean) || questionErrors.optionsCount || questionErrors.correct) &&
                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-current bg-rose-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active slide: one question card is in the document at a time. */}
        <div id="manual-quiz-active-question" role="tabpanel" className="mt-4 min-w-0">
          {activeQuestion && (
            <QuestionCard
              key={activeQuestion.id}
              question={activeQuestion}
              index={activeIndex}
              errors={activeErrors}
              submitted={submitted}
              canRemove={questions.length > 1}
              autoFocus={false}
              mode={mode}
              theme={theme}
              touched={touchedByQuestion[activeQuestion.id] || {}}
              onTouch={touchField}
              onChange={updateQuestion}
              onRemove={removeQuestion}
            />
          )}
        </div>

        {/* Previous / Next carousel navigation */}
        <div className="mt-3 flex flex-col-reverse gap-2 sm:mt-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => goToQuestion(activeIndex - 1)}
            disabled={activeIndex === 0}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition sm:px-4 sm:py-3 sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto ${inactiveNav}`}
          >
            <ChevronLeft /> Previous question
          </button>

          <button
            type="button"
            onClick={() => goToQuestion(activeIndex + 1)}
            disabled={activeIndex === questions.length - 1}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white sm:px-5 sm:py-3 sm:text-sm transition hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Next question <ChevronRight />
          </button>
        </div>

        {/* Add question */}
        <button
          type="button"
          onClick={addQuestion}
          disabled={atLimit}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-blue-500/70 px-3 py-2.5 text-xs font-semibold sm:mt-4 sm:px-4 sm:py-3 sm:text-sm text-blue-600 transition hover:bg-blue-600/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <PlusIcon /> Add another question
        </button>
        <p className={`mt-2 text-center text-[11px] sm:text-xs ${mutedText}`}>
          {atLimit
            ? `Maximum of ${LIMITS.maxQuestions} questions reached.`
            : "New questions open automatically. Select a number above to jump between questions."}
        </p>
      </section>

      {/* Validation summary and save */}
      {submitted && errors.count > 0 && (
        <p role="alert" className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-center text-sm font-medium text-rose-500">
          Please fix {errors.count} issue{errors.count === 1 ? "" : "s"} before saving.
        </p>
      )}

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-blue-700 py-3 text-xs font-bold sm:mt-5 sm:py-3.5 sm:text-sm text-white shadow-lg shadow-blue-700/15 transition hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Save Quiz
      </button>
    </form>
  );
}
