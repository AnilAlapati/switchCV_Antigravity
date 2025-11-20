"use client";

import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                        My Resumes
                    </h1>
                    <p className="text-gray-400">Manage and create your professional resumes.</p>
                </div>
                <Link href="/dashboard/create">
                    <Button className="btn-primary h-12 px-6 rounded-xl text-base font-medium">
                        <Plus className="mr-2 h-5 w-5" />
                        New Resume
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Create New Resume Card */}
                <Link href="/dashboard/create" className="group">
                    <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center space-y-6 border border-dashed border-white/10 rounded-2xl hover:border-white/30 hover:bg-white/5 transition-all duration-300">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Plus className="h-8 w-8 text-indigo-400" />
                        </div>
                        <div className="space-y-2 px-6">
                            <h3 className="text-lg font-semibold text-white">Create New Resume</h3>
                            <p className="text-sm text-gray-500">
                                Start from scratch with our AI assistant.
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Tips Card */}
                <div className="premium-card p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <FileText className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="font-semibold text-lg text-white">Pro Tips</h3>
                        </div>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex gap-3">
                                <span className="text-indigo-400">•</span>
                                Use action verbs to start your bullet points
                            </li>
                            <li className="flex gap-3">
                                <span className="text-indigo-400">•</span>
                                Quantify your achievements with numbers
                            </li>
                            <li className="flex gap-3">
                                <span className="text-indigo-400">•</span>
                                Tailor your resume for each job application
                            </li>
                        </ul>
                    </div>
                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">
                        Read Guide
                    </Button>
                </div>
            </div>
        </div>
    );
}
