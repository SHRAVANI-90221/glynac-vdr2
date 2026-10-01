"use client";

import { useEffect, useState } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  citation?: string;
};

type Thread = {
  id: number;
  title: string;
  subtitle: string;
  messages: Message[];
  pinned: boolean;
  group: "Today" | "Yesterday" | "Previous 7 Days";
};

const quickPrompts = [
  "Check investment agreement for guaranteed return clauses",
  "Explain FINRA Rule 2210",
  "Find compliance risks in this document",
];

const firstMessage: Message = {
  id: 1,
  role: "assistant",
  content:
    "Hello! I'm your Compliance AI Assistant. I can help you review financial documents, identify compliance risks, and explain regulatory rules.",
  citation: "FINRA Rule 2210 §4",
};

const defaultThreads: Thread[] = [
  {
    id: 1,
    title: "Compliance Review",
    subtitle: "Investment Agreement",
    messages: [firstMessage],
    pinned: false,
    group: "Today",
  },
  {
    id: 2,
    title: "SEC Disclosure Review",
    subtitle: "SEC Compliance",
    messages: [],
    pinned: false,
    group: "Yesterday",
  },
  {
    id: 3,
    title: "FINRA Rule Analysis",
    subtitle: "FINRA Rules",
    messages: [],
    pinned: false,
    group: "Yesterday",
  },
  {
    id: 4,
    title: "Portfolio Policy Check",
    subtitle: "Portfolio Policy",
    messages: [],
    pinned: false,
    group: "Previous 7 Days",
  },
];

export default function ChatPage() {
  const [threads, setThreads] = useState<Thread[]>(defaultThreads);
  const [activeThreadId, setActiveThreadId] = useState(1);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const [showCitation, setShowCitation] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load saved conversations
  useEffect(() => {
    const saved = localStorage.getItem("compliance-chat-threads");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setThreads(parsed);
      } catch {
        console.log("Could not load saved conversations.");
      }
    }
  }, []);

  // Save conversations
  useEffect(() => {
    localStorage.setItem(
      "compliance-chat-threads",
      JSON.stringify(threads)
    );
  }, [threads]);

  const activeThread =
    threads.find((thread) => thread.id === activeThreadId) ||
    threads[0];

  const messages = activeThread?.messages || [];

  // -----------------------------
  // SEND MESSAGE
  // -----------------------------
  const sendMessage = (text?: string) => {
    const messageText = text || input.trim();

    if (!messageText || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: messageText,
    };

    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === activeThreadId
          ? {
              ...thread,
              messages: [...thread.messages, userMessage],
              title:
                thread.messages.length === 0
                  ? messageText.slice(0, 30)
                  : thread.title,
            }
          : thread
      )
    );

    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "Based on the compliance context provided, I found several points that should be reviewed.\n\n• Check whether the agreement contains guaranteed-return language.\n• Verify that all performance claims are supported by appropriate disclosures.\n• Review the communication against the applicable FINRA advertising requirements.\n\nI recommend reviewing the highlighted sections before approval.",
        citation: "FINRA Rule 2210 §4",
      };

      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === activeThreadId
            ? {
                ...thread,
                messages: [...thread.messages, aiMessage],
              }
            : thread
        )
      );

      setIsTyping(false);
    }, 1800);
  };

  // -----------------------------
  // NEW CONVERSATION
  // -----------------------------
  const createNewThread = () => {
    const newThread: Thread = {
      id: Date.now(),
      title: "New Conversation",
      subtitle: "New compliance chat",
      messages: [],
      pinned: false,
      group: "Today",
    };

    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);

    setSearchQuery("");
    setShowSearch(false);
    setAttachedFile(null);
  };

  // -----------------------------
  // DELETE THREAD
  // -----------------------------
  const deleteThread = (id: number) => {
    const remaining = threads.filter((thread) => thread.id !== id);

    if (remaining.length === 0) {
      const newThread: Thread = {
        id: Date.now(),
        title: "New Conversation",
        subtitle: "New compliance chat",
        messages: [],
        pinned: false,
        group: "Today",
      };

      setThreads([newThread]);
      setActiveThreadId(newThread.id);
      return;
    }

    setThreads(remaining);

    if (id === activeThreadId) {
      setActiveThreadId(remaining[0].id);
    }
  };

  // -----------------------------
  // RENAME THREAD
  // -----------------------------
  const renameThread = (id: number) => {
    const thread = threads.find((item) => item.id === id);

    if (!thread) return;

    const newName = window.prompt(
      "Enter new conversation name:",
      thread.title
    );

    if (!newName?.trim()) return;

    setThreads((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              title: newName.trim(),
            }
          : item
      )
    );
  };

  // -----------------------------
  // PIN THREAD
  // -----------------------------
  const togglePin = (id: number) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              pinned: !thread.pinned,
            }
          : thread
      )
    );
  };

  // -----------------------------
  // FILE
  // -----------------------------
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setAttachedFile(file);
    }
  };

  // -----------------------------
  // SEARCH
  // -----------------------------
  const filteredMessages = messages.filter((message) =>
    message.content
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const todayThreads = threads
    .filter((thread) => thread.group === "Today")
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const yesterdayThreads = threads.filter(
    (thread) => thread.group === "Yesterday"
  );

  const previousThreads = threads.filter(
    (thread) => thread.group === "Previous 7 Days"
  );

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <main className="min-h-screen bg-[#0b1120] text-white">
      <div className="flex h-screen overflow-hidden">

        {/* SIDEBAR */}
        <aside className="hidden w-72 flex-col border-r border-slate-700 bg-[#111827] md:flex">

          <div className="border-b border-slate-700 p-5">
            <h1 className="text-xl font-bold">
              Compliance AI
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Real-Time Compliance Assistant
            </p>

            <button
              onClick={createNewThread}
              className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold transition hover:bg-blue-500"
            >
              + New Conversation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">

            {/* TODAY */}
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Today
            </p>

            {todayThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`group mb-2 cursor-pointer rounded-lg px-3 py-3 transition ${
                  activeThreadId === thread.id
                    ? "bg-blue-600/20"
                    : "hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">
                    {thread.pinned && "📌 "}
                    {thread.title}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin(thread.id);
                    }}
                    className="text-xs opacity-60 hover:opacity-100"
                    title="Pin / Unpin"
                  >
                    📌
                  </button>
                </div>

                <p className="mt-1 truncate text-xs text-slate-400">
                  {thread.subtitle}
                </p>

                <div className="mt-2 hidden gap-2 group-hover:flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      renameThread(thread.id);
                    }}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    ✏️ Rename
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      if (
                        window.confirm(
                          "Delete this conversation?"
                        )
                      ) {
                        deleteThread(thread.id);
                      }
                    }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}

            {/* YESTERDAY */}
            <p className="mb-2 mt-6 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Yesterday
            </p>

            {yesterdayThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`group mb-2 cursor-pointer rounded-lg px-3 py-3 transition ${
                  activeThreadId === thread.id
                    ? "bg-blue-600/20"
                    : "hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    {thread.title}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin(thread.id);
                    }}
                    className="text-xs opacity-60 hover:opacity-100"
                  >
                    📌
                  </button>
                </div>

                <div className="mt-2 hidden gap-2 group-hover:flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      renameThread(thread.id);
                    }}
                    className="text-xs text-blue-400"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      if (
                        window.confirm(
                          "Delete this conversation?"
                        )
                      ) {
                        deleteThread(thread.id);
                      }
                    }}
                    className="text-xs text-red-400"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            {/* PREVIOUS 7 DAYS */}
            <p className="mb-2 mt-6 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Previous 7 Days
            </p>

            {previousThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`group mb-2 cursor-pointer rounded-lg px-3 py-3 transition ${
                  activeThreadId === thread.id
                    ? "bg-blue-600/20"
                    : "hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    {thread.title}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin(thread.id);
                    }}
                    className="text-xs opacity-60 hover:opacity-100"
                  >
                    📌
                  </button>
                </div>

                <div className="mt-2 hidden gap-2 group-hover:flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      renameThread(thread.id);
                    }}
                    className="text-xs text-blue-400"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      if (
                        window.confirm(
                          "Delete this conversation?"
                        )
                      ) {
                        deleteThread(thread.id);
                      }
                    }}
                    className="text-xs text-red-400"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* USER */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold">
                S
              </div>

              <div>
                <p className="text-sm font-medium">
                  Compliance Officer
                </p>

                <p className="text-xs text-slate-500">
                  Online
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CHAT */}
        <section className="flex min-w-0 flex-1 flex-col">

          {/* HEADER */}
          <header className="border-b border-slate-700 bg-[#111827] px-5 py-4">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  {activeThread?.title || "Compliance Review"}
                </h2>

                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  AI Assistant Online
                </div>
              </div>

              <button
                onClick={() => setShowSearch(!showSearch)}
                className="rounded-lg border border-slate-600 px-3 py-2 text-sm transition hover:bg-slate-800"
              >
                🔍 Search
              </button>
            </div>

            {/* SEARCH */}
            {showSearch && (
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    autoFocus
                    placeholder="Search messages..."
                    className="flex-1 rounded-lg border border-slate-600 bg-[#172033] px-4 py-2 text-sm text-white outline-none focus:border-blue-500"
                  />

                  {searchQuery && (
                    <span className="text-xs text-slate-400">
                      {filteredMessages.length} result(s)
                    </span>
                  )}

                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearch(false);
                    }}
                    className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </header>

          {/* MESSAGES */}
          <div className="flex-1 space-y-6 overflow-y-auto p-5 md:p-8">

            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="max-w-3xl">

                  <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                    {message.role === "assistant" ? (
                      <>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600">
                          AI
                        </span>

                        Compliance AI
                      </>
                    ) : (
                      <>You</>
                    )}
                  </div>

                  <div
                    className={`whitespace-pre-line rounded-2xl px-5 py-4 text-sm leading-7 ${
                      message.role === "user"
                        ? "bg-blue-600"
                        : "border border-slate-700 bg-[#172033]"
                    }`}
                  >
                    {message.content}
                  </div>

                  {/* CITATION */}
                  {message.role === "assistant" &&
                    message.citation && (
                      <div className="relative mt-3">

                        <button
                          onClick={() =>
                            setShowCitation(!showCitation)
                          }
                          className="rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-300 transition hover:bg-blue-500/20"
                        >
                          📚 {message.citation}
                        </button>

                        {showCitation && (
                          <div className="absolute left-0 top-10 z-20 w-80 rounded-xl border border-slate-600 bg-[#111827] p-4 shadow-2xl">

                            <p className="text-sm font-semibold">
                              Source Reference
                            </p>

                            <p className="mt-2 text-xs leading-5 text-slate-400">
                              FINRA Rule 2210 provides requirements
                              relating to communications with the
                              public, including standards for fair
                              and balanced communications.
                            </p>

                            <button className="mt-3 text-xs text-blue-400 hover:underline">
                              View source document →
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                  {/* ACTIONS */}
                  {message.role === "assistant" && (
                    <div className="mt-2 flex gap-2">

                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            message.content
                          )
                        }
                        className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-800 hover:text-white"
                      >
                        Copy
                      </button>

                      <button
                        onClick={() =>
                          sendMessage(
                            "Please regenerate your previous compliance response."
                          )
                        }
                        className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-800 hover:text-white"
                      >
                        Regenerate
                      </button>

                      <button className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-800 hover:text-white">
                        👍
                      </button>

                      <button className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-800 hover:text-white">
                        👎
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* EMPTY SEARCH */}
            {searchQuery &&
              filteredMessages.length === 0 && (
                <div className="py-10 text-center text-sm text-slate-500">
                  No messages found for "{searchQuery}"
                </div>
              )}

            {/* TYPING */}
            {isTyping && (
              <div className="flex items-center gap-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-xs">
                  AI
                </div>

                <div className="rounded-2xl border border-slate-700 bg-[#172033] px-5 py-4">
                  <div className="flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce [animation-delay:150ms]">
                      ●
                    </span>
                    <span className="animate-bounce [animation-delay:300ms]">
                      ●
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* QUICK PROMPTS */}
          <div className="border-t border-slate-700 bg-[#0f172a] px-5 pt-4">

            <p className="mb-3 text-xs text-slate-500">
              Suggested Quick Prompts
            </p>

            <div className="flex gap-2 overflow-x-auto pb-3">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="whitespace-nowrap rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-xs text-slate-300 transition hover:border-blue-500 hover:text-blue-300"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT */}
          <div className="bg-[#0f172a] p-5">

            {attachedFile && (
              <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-700 bg-[#172033] px-4 py-3">

                <div className="flex items-center gap-3">
                  <span>📎</span>

                  <div>
                    <p className="text-sm">
                      {attachedFile.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {(attachedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setAttachedFile(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex items-end gap-3 rounded-2xl border border-slate-700 bg-[#172033] p-3">

              <label className="cursor-pointer rounded-lg p-2 text-xl transition hover:bg-slate-700">
                📎

                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask the Compliance AI Assistant..."
                rows={2}
                className="flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-500"
              />

              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send
              </button>
            </div>

            <p className="mt-2 text-center text-[11px] text-slate-600">
              AI responses are simulated for this frontend demonstration.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}