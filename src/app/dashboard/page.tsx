"use client";

import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        <span className="gradient-text">My Resumes</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">Manage and create your professional resumes.</p>
                </div>
                <Link href="/dashboard/create">
                    <Button className="btn-gradient px-6 py-6 rounded-xl text-base font-semibold shadow-lg hover:shadow-2xl transition-all">
                        <Plus className="mr-2 h-5 w-5" />
                        New Resume
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Placeholder for resume list - will be replaced with actual resumes */}
                <div className="glass-card group min-h-[280px] flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-white/10 hover:border-white/30">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50 animate-pulse-slow" />
                        <div className="relative p-5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-white/10">
                            <Plus className="h-10 w-10 text-purple-400" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">No resumes yet</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Create your first AI-powered resume and land your dream job.
                        </p>
                    </div>
                    <Link href="/dashboard/create">
                        <Button className="btn-gradient px-5 py-2 rounded-lg font-medium">
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Example resume card (uncomment when you have actual data) */}
                {/* 
                <div className="glass-card group cursor-pointer">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg glow-cyan">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">Software Engineer Resume</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span>Created Jan 15, 2024</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Professional resume for senior software engineering positions
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">View</Button>
                        <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                    </div>
                </div>
                */}
            </div>
        </div>
    );
}
