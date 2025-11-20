"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Bot, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface Message {
    role: "user" | "model";
    content: string;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initial greeting
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    role: "model",
                    content: "Hello! I'm your AI Resume Architect. I'm here to help you build a professional, high-impact resume. To get started, could you please tell me your full name?",
                },
            ]);
        }
    }, []);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user" as const, content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            const data = await response.json();

            if (data.resumeData) {
                // Reserve a sequential ID
                const idResponse = await fetch("/api/reserve-id", {
                    method: "POST",
                });

                if (!idResponse.ok) {
                    throw new Error("Failed to reserve ID");
                }

                const { id: reservedId } = await idResponse.json();

                // Save to Firestore with the reserved ID
                const resumeRef = doc(db, "resumes", reservedId);
                await setDoc(resumeRef, {
                    ...data.resumeData,
                    createdAt: serverTimestamp(),
                });

                // Simulate a "saving" delay then redirect
                setMessages((prev) => [
                    ...prev,
                    { role: "model", content: `Perfect! I have everything I need. Your resume ID is ${reservedId}. Generating your resume now...` }
                ]);

                setTimeout(() => {
                    router.push(`/resumes/${reservedId}`);
                }, 1500);

            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: "model", content: data.response },
                ]);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            setMessages((prev) => [
                ...prev,
                { role: "model", content: "Sorry, I encountered an error. Please try again." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col h-[700px] w-full max-w-3xl mx-auto glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {/* Chat Header */}
            <div className="relative p-6 border-b border-white/5 bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="relative p-3 bg-white/5 rounded-xl border border-white/10">
                            <Bot className="w-6 h-6 text-indigo-400" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="font-semibold text-lg text-white">Resume Architect</h2>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI-powered resume builder
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium text-gray-400">
                        {messages.length} messages
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                    ? "bg-indigo-600 text-white rounded-br-sm"
                                    : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-bl-sm flex items-center gap-3">
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                            <span className="text-sm text-gray-400">Thinking...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                    }}
                    className="flex gap-3"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your answer..."
                        className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl h-12 px-4"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="btn-primary h-12 px-6 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
