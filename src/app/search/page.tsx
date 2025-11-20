"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchPage() {
    const [id, setId] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (id.trim()) {
            router.push(`/resumes/${id.trim()}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md space-y-8 text-center">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter">Find Talent</h1>
                    <p className="text-muted-foreground">Enter a Resume ID to view a candidate's profile.</p>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Enter Resume ID (e.g., 12345678)"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="h-12 text-lg"
                    />
                    <Button type="submit" size="lg" className="h-12 w-12 px-0">
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                </form>

                <div className="text-sm text-muted-foreground">
                    <p>Try searching for ID: <span className="font-mono text-primary">12345678</span></p>
                </div>
            </div>
        </div>
    );
}
