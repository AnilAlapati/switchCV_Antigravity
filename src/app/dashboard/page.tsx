"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Resumes</h1>
                    <p className="text-muted-foreground">Manage and create your resumes.</p>
                </div>
                <Link href="/dashboard/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Resume
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Placeholder for resume list */}
                <div className="glass-dark p-6 rounded-xl border border-dashed border-muted-foreground/25 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
                    <div className="p-4 bg-muted/10 rounded-full">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold">No resumes yet</h3>
                        <p className="text-sm text-muted-foreground">Create your first AI-powered resume.</p>
                    </div>
                    <Link href="/dashboard/create">
                        <Button variant="outline">Get Started</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
