"use client";

import { useAuth } from "@/components/features/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, LogOut, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen">
            {/* Modern Navigation */}
            <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
                <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center space-x-2 group">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg glow-purple transition-all group-hover:scale-105">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-black gradient-text">SwitchCV</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-1">
                            <Link href="/dashboard">
                                <Button variant="ghost" className="hover:bg-white/10 rounded-xl">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/dashboard/create">
                                <Button variant="ghost" className="hover:bg-white/10 rounded-xl">
                                    Create Resume
                                </Button>
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="glass px-4 py-2 rounded-xl hidden sm:flex items-center gap-2">
                            <User className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-medium">{user.email}</span>
                        </div>
                        <Button
                            onClick={handleSignOut}
                            variant="ghost"
                            size="sm"
                            className="hover:bg-red-500/10 hover:text-red-400 rounded-xl"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container py-12 max-w-screen-2xl">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 glass mt-20">
                <div className="container py-8 max-w-screen-2xl">
                    <p className="text-center text-sm text-muted-foreground">
                        © 2024 <span className="gradient-text font-semibold">SwitchCV</span>. Built with AI.
                    </p>
                </div>
            </footer>
        </div>
    );
}
