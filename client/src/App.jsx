import { useEffect, useState } from "react";
import LogoIcon from "./assets/icon.svg?react";
import axios from "axios";

const API_BASE = "https://ablag.onrender.com";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("ablag-theme") || "light"
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("ablag-theme", theme);
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult("");
    const trimmed = text.trim();
    if (!trimmed) {
      setError("يرجى إدخال نص");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/rephrase`, {
        text: trimmed,
      });
      setResult(res.data?.rephrased || "");
    } catch (err) {
      setError("حدث خطأ أثناء إعادة الصياغة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-3xl mx-auto p-6 font-['Roboto',_system-ui,_sans-serif]">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoIcon
              className="w-24 text-blue-900 dark:text-white"
              aria-label="أبلغ"
            />
          </div>
          <div className="flex gap-2">
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </header>
        <p className="mt-2 mb-6 text-[var(--muted)]">
          أدخل نصًا بالعربية لإعادة صياغته بشكل فصيح واحترافي.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 fade-up">
          <label className="text-sm text-[var(--muted)]">النص الأصلي</label>
          <textarea
            dir="rtl"
            lang="ar"
            className="w-full p-4 rounded-xl border text-base outline-none transition shadow-none bg-[var(--surface)] text-[var(--text)] border-[var(--border)] focus:ring-2 focus:ring-blue-700"
            rows={8}
            placeholder="أدخل النص هنا..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-3 rounded-full text-white text-base cursor-pointer shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow)] active:scale-95 bg-[var(--primary)]"
          >
            {loading ? "جارٍ المعالجة..." : "أعد الصياغة"}
          </button>
        </form>

        {error && <div className="mt-3 text-red-500">{error}</div>}

        {result && (
          <div className="mt-6 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow)] fade-up">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg">الصياغة المُحسَّنة</h2>
              <CopyButton text={result} copied={copied} setCopied={setCopied} />
            </div>
            <p className="text-lg leading-8 whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ThemeToggle({ theme, setTheme }) {
  const toggle = () => setTheme(theme === "light" ? "dark" : "light");
  return (
    <button onClick={toggle} aria-label="تبديل السمة">
      <span className="inline-flex items-center">
        {theme === "dark" ? <IconSun /> : <IconMoon />}
      </span>
    </button>
  );
}

function CopyButton({ text, copied, setCopied }) {
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {}
  };
  return (
    <button
      onClick={doCopy}
      aria-label="نسخ النص"
      className="px-3 py-2 rounded-full border border-[var(--border)] bg-transparent transition hover:bg-black/5"
    >
      <span className="inline-flex items-center gap-2">
        {copied ? <IconCheck /> : <IconCopy />}
        {copied ? "تم النسخ" : "نسخ"}
      </span>
    </button>
  );
}

function IconSun(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#facc15"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="4" fill="#facc15" stroke="#facc15"></circle>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
function IconMoon(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function IconCopy(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function IconCheck(props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
