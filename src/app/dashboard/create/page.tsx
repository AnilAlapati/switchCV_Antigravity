"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/features/AuthProvider";

type Message = {
    role: "user" | "model";
    content: string;
};

export default function CreateResumePage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", content: "Hi! I'm your Resume Agent. I'm here to help you build a professional resume. Let's start with your name. What is your full name?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user" as const, content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setMessages((prev) => [
                ...prev,
                { role: "model", content: data.response }
            ]);

            if (data.resumeData) {
                await saveResume(data.resumeData);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [
                ...prev,
                { role: "model", content: "Sorry, I encountered an error. Please try again." }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const saveResume = async (resumeData: unknown) => {
        if (!user) {
            console.error("User not authenticated");
            return;
        }
        try {
            const resumeId = Math.floor(10000000 + Math.random() * 90000000).toString();

            await setDoc(doc(db, "resumes", resumeId), {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(resumeData as any),
                userId: user.uid,
                createdAt: new Date().toISOString(),
                id: resumeId
            });

            // Also save a reference in the user's subcollection if needed, or just query by userId later.
            // For now, we just redirect.
            window.location.href = `/resumes/${resumeId}`;

        } catch (e) {
            console.error("Error saving resume:", e);
            setMessages((prev) => [
                ...prev,
                { role: "model", content: "I created your resume but failed to save it. Please try again." }
            ]);
        }
    };

    return (
        <div className="max-w-3xl mx-auto h-[80vh] flex flex-col glass-dark rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    Resume Agent
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex w-full",
                            msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                                msg.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                            )}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2 text-sm animate-pulse">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your answer..."
                        className="bg-background/50"
                        disabled={loading}
                    />
                    <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
