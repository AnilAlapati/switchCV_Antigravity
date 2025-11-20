"use client";

import ChatInterface from "@/components/features/ChatInterface";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateResumePage() {
    return (
        <div className="container mx-auto max-w-4xl py-8 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Create New Resume</h1>
                    <p className="text-muted-foreground">Chat with our AI to build your resume.</p>
                </div>
            </div>

            <ChatInterface />
        </div>
    );
}
