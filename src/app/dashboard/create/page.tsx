"use client";

import ChatInterface from "@/components/features/ChatInterface";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CreateResumePage() {
    return (
        <div className="container mx-auto max-w-6xl py-12 space-y-12">
            {/* Page Header */}
            <div className="space-y-6">
                <Link href="/dashboard">
                    <Button variant="ghost" className="glass hover:bg-white/10 -ml-2 mb-4 rounded-xl">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>

                <div className="relative">
                    {/* Decorative blob */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

                    <div className="relative space-y-3">
                        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium mb-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span>AI Resume Builder</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                            Create Your <span className="gradient-text">Perfect Resume</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                            Chat with our AI assistant to build a professional, ATS-optimized resume tailored to your experience.
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Interface */}
            <ChatInterface />
        </div>
    );
}
