import { memo, useCallback, useId, useMemo, useRef, useState } from "react";

/* ---------- Limits & helpers (outside component) ---------- */

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
  id: `q-${++idCounter}`,
  text: "",
  options: OPTION_LABELS.map(() => ({ text: "", correct: false })),
  explanation: "",
});

const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");

/** Pure validation: returns an error object per question. No side effects. */
function validateQuiz(name, questions) {
  const result = { name: null, questions: {}, count: 0 };

  if (!name.trim()) result.name = "Quiz name is required.";
  else if (name.trim().length < 3) result.name = "Quiz name must be at least 3 characters.";
  if (result.name) result.count++;

  const seenQuestions = new Set();

  questions.forEach((q) => {
    const err = { text: null, options: [null, null, null, null], correct: null };

    const text = norm(q.text);
    if (!text) err.text = "Question text is required.";
    else if (text.length < 5) err.text = "Question must be at least 5 characters.";
    else if (seenQuestions.has(text)) err.text = "This question is a duplicate of an earlier one.";
    seenQuestions.add(text);

    const seenOptions = new Set();
    q.options.forEach((opt, i) => {
      const t = norm(opt.text);
      if (!t) err.options[i] = `Option ${OPTION_LABELS[i]} cannot be empty.`;
      else if (seenOptions.has(t)) err.options[i] = "Options must be unique.";
      seenOptions.add(t);
    });

    if (!q.options.some((o) => o.correct)) err.correct = "Select at least one correct answer.";
    if (q.options.every((o) => o.correct)) err.correct = "Not every option can be correct.";

    result.count +=
      Number(!!err.text) + err.options.filter(Boolean).length + Number(!!err.correct);
    result.questions[q.id] = err;
  });

  return result;
}

/* ---------- Small UI pieces ---------- */

const FieldError = memo(function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-rose-400">
      {message}
    </p>
  );
});

const baseField =
  "w-full rounded-md bg-[#1a1a35] text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-1 transition focus:ring-2";
const fieldRing = (invalid) =>
  invalid ? "ring-rose-500/70 focus:ring-rose-500" : "ring-transparent focus:ring-indigo-500";

/* ---------- Question card ---------- */

const QuestionCard = memo(function QuestionCard({
  question,
  index,
  errors,
  submitted,
  canRemove,
  autoFocus,
  onChange,
  onRemove,
}) {
  const uid = useId();
  // Local "touched" state keeps this card memoizable.
  const [touched, setTouched] = useState({});
  const touch = (key) => setTouched((t) => (t[key] ? t : { ...t, [key]: true }));
  const show = (key) => submitted || touched[key];

  const handleText = (e) => onChange(question.id, { text: e.target.value });
  const handleExplanation = (e) => onChange(question.id, { explanation: e.target.value });

  const handleOption = (i, patch) => {
    const options = question.options.map((o, idx) => (idx === i ? { ...o, ...patch } : o));
    onChange(question.id, { options });
  };

  const textError = show("text") ? errors.text : null;
  const correctError = show("correct") ? errors.correct : null;

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-[#0d0d1f] p-4 shadow-lg sm:p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-slate-100">Question {index + 1}</h3>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(question.id)}
            aria-label={`Remove question ${index + 1}`}
            className="rounded-md px-2 py-1 text-xs text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            Remove
          </button>
        )}
      </div>

      {/* Question text */}
      <textarea
        autoFocus={autoFocus}
        value={question.text}
        maxLength={LIMITS.question}
        onChange={handleText}
        onBlur={() => touch("text")}
        placeholder="Enter your question"
        aria-label={`Question ${index + 1} text`}
        aria-invalid={!!textError}
        aria-describedby={textError ? `${uid}-text` : undefined}
        className={`${baseField} ${fieldRing(!!textError)} h-28 resize-y px-5 py-4 sm:h-36`}
      />
      <div className="flex items-start justify-between gap-3">
        <FieldError id={`${uid}-text`} message={textError} />
        <span className="ml-auto mt-1.5 text-xs text-slate-500">
          {question.text.length}/{LIMITS.question}
        </span>
      </div>

      {/* Options */}
      <fieldset className="mt-3 space-y-3" aria-describedby={correctError ? `${uid}-correct` : undefined}>
        <legend className="sr-only">Answer options for question {index + 1}</legend>
        {question.options.map((opt, i) => {
          const key = `o${i}`;
          const optError = show(key) ? errors.options[i] : null;
          return (
            <div key={i}>
              <div
                className={`flex items-center gap-4 rounded-md bg-[#1a1a35] px-4 py-3 ring-1 transition focus-within:ring-2 ${
                  optError ? "ring-rose-500/70 focus-within:ring-rose-500" : "ring-transparent focus-within:ring-indigo-500"
                }`}
              >
                <input
                  type="checkbox"
                  checked={opt.correct}
                  onChange={(e) => {
                    touch("correct");
                    handleOption(i, { correct: e.target.checked });
                  }}
                  aria-label={`Mark option ${OPTION_LABELS[i]} as correct`}
                  className="h-4 w-4 shrink-0 cursor-pointer accent-indigo-500"
                />
                <input
                  type="text"
                  value={opt.text}
                  maxLength={LIMITS.option}
                  onChange={(e) => handleOption(i, { text: e.target.value })}
                  onBlur={() => touch(key)}
                  placeholder={`Option ${OPTION_LABELS[i]}`}
                  aria-label={`Option ${OPTION_LABELS[i]}`}
                  aria-invalid={!!optError}
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-300"
                />
              </div>
              <FieldError message={optError} />
            </div>
          );
        })}
        <FieldError id={`${uid}-correct`} message={correctError} />
      </fieldset>

      {/* Optional explanation */}
      <label className="mt-4 block text-xs font-medium text-slate-400" htmlFor={`${uid}-exp`}>
        Explanation <span className="text-slate-500">(optional, shown after answering)</span>
      </label>
      <textarea
        id={`${uid}-exp`}
        value={question.explanation}
        maxLength={LIMITS.explanation}
        onChange={handleExplanation}
        placeholder="Why is this the correct answer?"
        className={`${baseField} ${fieldRing(false)} mt-1.5 h-20 resize-y px-4 py-3`}
      />
    </article>
  );
});

/* ---------- Main component ---------- */

export default function ManualQuiz({ onSubmit }) {
  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [questions, setQuestions] = useState(() => [createQuestion()]);
  const [submitted, setSubmitted] = useState(false);
  const [focusId, setFocusId] = useState(null);
  const formRef = useRef(null);
  const nameId = useId();

  const errors = useMemo(() => validateQuiz(name, questions), [name, questions]);

  const updateQuestion = useCallback((id, patch) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }, []);

  const removeQuestion = useCallback((id) => {
    setQuestions((prev) => (prev.length > 1 ? prev.filter((q) => q.id !== id) : prev));
  }, []);

  const addQuestion = useCallback(() => {
    const q = createQuestion();
    setQuestions((prev) => (prev.length >= LIMITS.maxQuestions ? prev : [...prev, q]));
    setFocusId(q.id);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (errors.count > 0) {
      // Wait for the error state to render, then focus the first invalid field.
      requestAnimationFrame(() => {
        formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    try {
      onSubmit?.({
        name: name.trim(),
        questions: questions.map((q) => ({
          text: q.text.trim(),
          options: q.options.map((o) => o.text.trim()),
          correct: q.options.flatMap((o, i) => (o.correct ? [i] : [])),
          explanation: q.explanation.trim(),
        })),
      });
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    }
  };

  const nameError = nameTouched || submitted ? errors.name : null;
  const atLimit = questions.length >= LIMITS.maxQuestions;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto w-full max-w-4xl rounded-2xl bg-linear-to-br from-[#1b1038] via-[#0b0b1a] to-[#0b0b1a] px-4 py-8 text-slate-100 scheme-dark] sm:px-6"
    >
      <header className="text-center">
        <h2 className="text-xl font-medium text-indigo-400 sm:text-2xl">Question Builder</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Architect your Quiz Board, Enter the question text and define potential answers
        </p>
      </header>

      {/* Quiz name */}
      <div className="mt-6">
        <label htmlFor={nameId} className="text-sm font-medium text-slate-100">
          Quiz Name
        </label>
        <input
          id={nameId}
          type="text"
          value={name}
          maxLength={LIMITS.name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setNameTouched(true)}
          placeholder="e.g. John's Demo Quiz"
          aria-invalid={!!nameError}
          aria-describedby={nameError ? `${nameId}-err` : undefined}
          className={`${baseField} ${fieldRing(!!nameError)} mt-2 px-4 py-3`}
        />
        <FieldError id={`${nameId}-err`} message={nameError} />
      </div>

      {/* Questions */}
      <div className="mt-6 space-y-6">
        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            errors={errors.questions[q.id]}
            submitted={submitted}
            canRemove={questions.length > 1}
            autoFocus={focusId === q.id}
            onChange={updateQuestion}
            onRemove={removeQuestion}
          />
        ))}
      </div>

      {/* Actions */}
      <button
        type="button"
        onClick={addQuestion}
        disabled={atLimit}
        className="mt-6 w-full rounded-md border border-blue-600 py-2 text-sm text-blue-500 transition hover:bg-blue-600/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        + Add Question
      </button>
      <p className="mt-2 text-center text-sm text-slate-200">
        {atLimit
          ? `Maximum of ${LIMITS.maxQuestions} questions reached.`
          : "Tap the checkbox for declaring a correct answer!"}
      </p>

      {submitted && errors.count > 0 && (
        <p role="alert" className="mt-4 rounded-md bg-rose-500/10 px-4 py-3 text-center text-sm text-rose-300">
          Please fix {errors.count} issue{errors.count > 1 ? "s" : ""} before saving.
        </p>
      )}

      <button
        type="submit"
        className="mt-5 w-full rounded-md bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b1a]"
      >
        Save Quiz
      </button>
    </form>
  );
}