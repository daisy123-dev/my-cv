import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Phone, MapPin, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string; timestamp: Date };

const quickSuggestions = [
  { label: "🍖 Recommendations", text: "What do you recommend?" },
  { label: "📋 View Menu", text: "Show me the menu" },
  { label: "📅 Book a Table", text: "I'd like to book a table" },
  { label: "📍 Location", text: "Where are you located?" },
  { label: "💰 Prices", text: "What are your prices?" },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const TypingIndicator = () => (
  <div className="flex items-end gap-2">
    <Avatar className="h-7 w-7 border border-primary/30">
      <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">EP</AvatarFallback>
    </Avatar>
    <div className="bg-muted/80 backdrop-blur-sm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
      <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  </div>
);

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to **Elparaiso Garden Kisii!** 🍖🍹\n\nI'm your virtual assistant — think of me as your personal waiter. Ask me about our menu, prices, reservations, or anything else!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages.map((m) => ({ role: m.role, content: m.content })) }),
      });

      if (!resp.ok || !resp.body) throw new Error("Failed to get response");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > allMessages.length) {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar, timestamp: new Date() }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again or reach out directly:\n\n📞 **Call**: [+254 700 000 000](tel:+254700000000)\n💬 **WhatsApp**: [Chat with us](https://wa.me/254700000000)",
          timestamp: new Date(),
        },
      ]);
    }

    setLoading(false);
    if (!open) setHasNewMessage(true);
  };

  const handleAction = (action: string) => {
    if (action === "call") {
      window.open("tel:+254700000000");
    } else if (action === "whatsapp") {
      window.open("https://wa.me/254700000000?text=Hello%20Elparaiso%20Garden!%20I%20have%20a%20question.", "_blank");
    } else if (action === "menu") {
      document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    } else if (action === "reserve") {
      document.querySelector("#reservations")?.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const showSuggestions = messages.length <= 2 && !loading;

  return (
    <>
      {/* Floating button with pulse ring */}
      <motion.button
        onClick={() => { setOpen(!open); setHasNewMessage(false); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gold-gradient flex items-center justify-center shadow-2xl"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="text-primary-foreground" size={22} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 300 }}>
              <MessageCircle className="text-primary-foreground" size={22} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Notification badge */}
        {hasNewMessage && !open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background animate-pulse" />
        )}
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full gold-gradient animate-ping opacity-20 pointer-events-none" />
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[400px] h-[min(75vh,600px)] flex flex-col rounded-2xl border border-primary/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
            style={{ background: "hsl(var(--card))" }}
          >
            {/* Header */}
            <div className="relative gold-gradient px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-primary-foreground/30">
                      <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xs font-bold">EP</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-primary-foreground font-bold text-base leading-tight">Elparaiso Assistant</h3>
                    <p className="text-primary-foreground/60 text-[11px] flex items-center gap-1">
                      <Sparkles size={10} /> Online • Ready to help
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                >
                  <X className="text-primary-foreground" size={16} />
                </button>
              </div>

              {/* Quick action bar */}
              <div className="flex gap-1.5 mt-3">
                {[
                  { icon: Phone, label: "Call", action: "call" },
                  { icon: MessageCircle, label: "WhatsApp", action: "whatsapp" },
                  { icon: MapPin, label: "Location", action: "menu" },
                  { icon: Clock, label: "24/7 Open", action: "" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => item.action && handleAction(item.action)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all
                      ${item.action
                        ? "bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 cursor-pointer"
                        : "bg-green-500/20 text-green-200 cursor-default"
                      }`}
                  >
                    <item.icon size={10} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages area */}
            <ScrollArea className="flex-1 min-h-0">
              <div ref={scrollRef} className="p-4 space-y-4">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i === messages.length - 1 ? 0.05 : 0 }}
                    className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <Avatar className="h-6 w-6 border border-primary/20 shrink-0 mb-4">
                        <AvatarFallback className="bg-primary/10 text-primary text-[8px] font-bold">EP</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col gap-0.5 max-w-[78%]">
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                          msg.role === "user"
                            ? "gold-gradient text-primary-foreground rounded-br-sm"
                            : "bg-muted/60 text-foreground rounded-bl-sm border border-border/50"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-1 [&_p]:mt-0 [&_a]:text-primary [&_a]:underline [&_strong]:text-foreground [&_ul]:my-1 [&_li]:my-0">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                      <span className={`text-[9px] text-muted-foreground/50 px-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <TypingIndicator />
                  </motion.div>
                )}

                {/* Suggestions */}
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-2"
                  >
                    <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2 px-1">Quick questions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {quickSuggestions.map((s) => (
                        <button
                          key={s.text}
                          onClick={() => sendMessage(s.text)}
                          className="text-[11px] px-3 py-1.5 rounded-full border border-primary/20 text-primary/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all duration-200"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input area */}
            <div className="border-t border-border/50 bg-card/80 backdrop-blur-sm p-3">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-muted/40 border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 transition-all"
                />
                <Button
                  type="submit"
                  variant="gold"
                  size="icon"
                  className="rounded-xl shrink-0 h-10 w-10 shadow-lg"
                  disabled={loading || !input.trim()}
                >
                  <Send size={16} />
                </Button>
              </form>
              <p className="text-[9px] text-center text-muted-foreground/40 mt-2">
                Powered by AI • Elparaiso Garden Kisii
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
