'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { api, ApiError } from '@/lib/api';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';

type Role = 'user' | 'assistant' | 'system';

interface Msg {
  role: Role;
  content: string;
}

const SUGGESTED = [
  'What are your most impressive projects?',
  'How do you approach scaling realtime systems?',
  'What are your strongest skills?',
  'Are you available for staff roles?',
];

export function AssistantDock() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content: 'Hi — I\u2019m the in-portfolio assistant. Ask me anything about projects, skills, or experience.',
    },
  ]);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    setError(null);
    const next: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setBusy(true);
    track({ type: 'ai_chat_message', metadata: { length: text.length } });
    try {
      const res = await api<{ conversationId: string; reply: string }>('/api/ai/chat', {
        method: 'POST',
        body: { conversationId, messages: next.filter((m) => m.role !== 'system') },
      });
      setConversationId(res.conversationId);
      setMessages((cur) => [...cur, { role: 'assistant', content: res.reply }]);
    } catch (err) {
      let msg = 'Something went wrong. Try again later.';
      if (err instanceof ApiError) {
        if (err.status === 503)
          msg = 'AI assistant is not configured yet (no OPENAI_API_KEY). I am still happy to read your contact form.';
        else if (err.status === 429) msg = 'Slow down — too many AI requests. Try again in a minute.';
      }
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen((o) => !o);
          track({ type: 'ai_dock_toggle', metadata: { open: !open } });
        }}
        aria-label="Open AI assistant"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-bg-elev/80 px-4 py-2.5 text-sm text-ink shadow-2xl backdrop-blur transition-transform hover:scale-105"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-cyan" />
        </span>
        Ask the assistant
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-20 right-5 z-50 flex h-[520px] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-bg-elev/95 shadow-2xl backdrop-blur-xl"
          >
            <header className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <div>
                <p className="font-display text-sm tracking-tight">Portfolio Assistant</p>
                <p className="text-[10px] uppercase tracking-widest text-ink-mute">
                  grounded on this site’s data
                </p>
              </div>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="rounded-full bg-white/5 p-1.5 text-ink-dim hover:bg-white/10 hover:text-ink"
              >
                ✕
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    'max-w-[88%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                    m.role === 'user'
                      ? 'ml-auto rounded-br-md bg-gradient-to-r from-accent to-accent-cyan text-bg'
                      : 'rounded-bl-md bg-white/5 text-ink',
                  )}
                >
                  {m.content}
                </div>
              ))}
              {busy && (
                <div className="flex max-w-[88%] gap-1 rounded-2xl rounded-bl-md bg-white/5 px-3.5 py-3">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-dim [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-dim [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-dim [animation-delay:300ms]" />
                </div>
              )}
              {error && (
                <div className="rounded-xl border border-rose-400/30 bg-rose-400/5 px-3 py-2 text-xs text-rose-200">
                  {error}
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 border-t border-white/5 px-3 py-2">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-ink-dim hover:bg-white/10 hover:text-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="flex items-center gap-2 border-t border-white/5 p-2.5"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the work…"
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-bg/50 px-3.5 py-2 text-sm text-ink placeholder:text-ink-mute outline-none focus:border-white/30"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="shrink-0 rounded-full bg-gradient-to-r from-accent to-accent-cyan px-3.5 py-2 text-xs font-medium text-bg disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
