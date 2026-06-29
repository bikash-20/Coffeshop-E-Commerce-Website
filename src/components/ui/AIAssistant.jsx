import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";

/* Floating AI assistant widget.
   - Lives bottom-left so it doesn't fight the existing FloatingWhatsApp
     (which is bottom-right) or the cart pill (top-right).
   - Persists a UUID session id in localStorage; that id is the only
     thing tying a chat history to a browser.
   - Talks to the Cloudflare Worker at VITE_WORKER_URL. If the env var
     is missing we render a helpful placeholder panel instead of
     failing silently.

   UI: matches the Coffee Luxe palette (coffee, gold, cream) and the
   existing Framer Motion micro-interactions (spring, staggered
   reveals, AnimatePresence for the panel). */

const QUICK_PROMPTS = [
  "What's on the menu?",
  "Recommend something sweet",
  "How do I order?",
  "What are the delivery fees?",
  "Are you open now?",
];

/* Generate a UUID v4 — tiny implementation, no extra deps. */
function uuid() {
  // crypto.randomUUID is available in all modern browsers; fall back
  // to a Math.random version for ancient runtimes.
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const SESSION_KEY = "coffeeLuxe.chatSessionId";

function getOrCreateSessionId() {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = uuid();
    localStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    // Private mode / disabled storage — generate ephemeral id.
    return uuid();
  }
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const sessionIdRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const workerUrl = import.meta.env.VITE_WORKER_URL;

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  /* Auto-scroll the message list to the bottom on each new message. */
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  /* Focus the input when the panel opens. */
  useEffect(() => {
    if (open) {
      // Wait for the open animation to settle so the input is interactable.
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    if (!workerUrl) {
      setError("VITE_WORKER_URL is not set. See README → AI assistant.");
      return;
    }

    setError(null);
    setInput("");
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setBusy(true);

    // Build a short history (last 6 turns) for the worker.
    const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch(`${workerUrl.replace(/\/$/, "")}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current, message: trimmed, history }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply, sources: data.sources },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Sorry — I couldn't reach the assistant right now. Please try again, or use the floating WhatsApp button for direct help.",
        },
      ]);
      setError(err?.message || "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      {/* Floating trigger button — bottom-left, hidden when panel is open. */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            key="ai-trigger"
            onClick={() => setOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Open AI assistant"
            data-cursor="hover"
            className="group fixed bottom-5 left-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/40 bg-coffee-900/90 text-gold-300 shadow-2xl shadow-black/40 backdrop-blur-md transition-colors hover:border-gold-500/70 hover:text-gold-200"
          >
            {/* Ambient pulse ring — gives the button a "live" feel. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 animate-ping rounded-full bg-gold-500/15"
            />
            <Sparkles className="h-6 w-6" />
            <span className="sr-only">Open AI assistant</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="ai-panel"
            role="dialog"
            aria-label="AI assistant"
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed bottom-5 left-5 right-5 z-[70] flex max-h-[80vh] flex-col overflow-hidden rounded-2xl border border-gold-500/20 bg-coffee-900 text-cream-100 shadow-2xl shadow-black/50 sm:bottom-6 sm:left-6 sm:right-auto sm:w-[22rem] sm:max-w-[calc(100vw-3rem)]"
          >
            {/* Header */}
            <header className="flex items-center justify-between gap-3 border-b border-gold-500/15 bg-coffee-950/60 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-500/15 text-gold-300">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="font-display text-sm font-semibold text-cream-100">
                    Coffee Luxe Assistant
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-cream-300">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Online · powered by Workers AI
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                data-cursor="hover"
                className="grid h-8 w-8 place-items-center rounded-full text-cream-300 transition-colors hover:bg-coffee-800 hover:text-cream-100"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* Message list */}
            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 && (
                <EmptyState onPick={(p) => sendMessage(p)} disabled={!workerUrl} hasWorker={!!workerUrl} />
              )}

              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} content={m.content} sources={m.sources} />
              ))}

              {busy && (
                <div className="flex items-end gap-2">
                  <Avatar role="assistant" />
                  <div className="rounded-2xl rounded-bl-sm border border-gold-500/15 bg-coffee-800/70 px-3 py-2">
                    <TypingDots />
                  </div>
                </div>
              )}

              {error && !busy && (
                <p className="rounded-lg border border-red-500/30 bg-red-950/30 px-3 py-2 text-[11px] text-red-200">
                  {error}
                </p>
              )}
            </div>

            {/* Quick prompts — shown only at the start of a conversation. */}
            {messages.length === 0 && workerUrl && (
              <div className="border-t border-gold-500/10 bg-coffee-950/30 px-3 py-2">
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => sendMessage(p)}
                      data-cursor="hover"
                      className="rounded-full border border-gold-500/25 bg-coffee-800/50 px-2.5 py-1 text-[11px] font-medium text-cream-200 transition-colors hover:border-gold-500/50 hover:bg-coffee-800 hover:text-gold-200"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Composer */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-gold-500/15 bg-coffee-950/70 px-3 py-2.5 backdrop-blur-md"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={workerUrl ? "Ask about the menu, hours, ordering…" : "VITE_WORKER_URL not set"}
                disabled={!workerUrl || busy}
                aria-label="Message"
                data-cursor="hover"
                className="touch-target flex-1 rounded-full border border-gold-500/20 bg-coffee-900/70 px-3 py-2 text-sm text-cream-100 placeholder:text-cream-400/60 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy || !workerUrl}
                aria-label="Send"
                data-cursor="hover"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-500 text-coffee-950 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ───────────── Sub-components ───────────── */

function EmptyState({ onPick, hasWorker }) {
  return (
    <div className="flex flex-col gap-3 py-2 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-gold-500/25 bg-gold-500/10 text-gold-300">
        <MessageCircle className="h-5 w-5" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-base font-semibold text-cream-100">
          Hi! I'm your Coffee Luxe concierge.
        </h3>
        <p className="mx-auto max-w-[18rem] text-[12px] text-cream-300">
          {hasWorker
            ? "Ask me about the menu, hours, ordering, or the shop's story. Tap a quick prompt or type your own."
            : "Set VITE_WORKER_URL in your .env to enable the live assistant. The widget is wired up; just point it at the Worker URL."}
        </p>
      </div>
    </div>
  );
}

function Bubble({ role, content, sources }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ y: 6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.18 }}
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <Avatar role={role} />
      <div
        className={`max-w-[80%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-gold-500/90 text-coffee-950"
            : "rounded-bl-sm border border-gold-500/15 bg-coffee-800/70 text-cream-100"
        }`}
      >
        {content}
        {!isUser && sources?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 border-t border-gold-500/10 pt-1.5">
            {sources.map((s) => (
              <span
                key={s.id}
                className="rounded-full bg-coffee-900/70 px-1.5 py-0.5 text-[10px] font-medium text-gold-300"
                title={s.title}
              >
                {s.title.length > 28 ? s.title.slice(0, 26) + "…" : s.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Avatar({ role }) {
  return (
    <span
      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
        role === "user"
          ? "bg-gold-500/20 text-gold-300"
          : "bg-coffee-800 text-gold-300"
      }`}
    >
      {role === "user" ? "You" : "AI"}
    </span>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-gold-400"
          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
