"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Lock, Mail, Sparkles } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-strong p-10 rounded-3xl space-y-8 max-w-md w-full shadow-2xl relative overflow-hidden">
            {/* Gradient accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-animated" />

            {/* Decorative blobs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />

            <div className="relative space-y-3 text-center">
                <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Welcome Back</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight">
                    <span className="gradient-text">Sign In</span>
                </h1>
                <p className="text-muted-foreground">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleLogin} className="relative space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-11 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent h-12 rounded-xl"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pl-11 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-transparent h-12 rounded-xl"
                        />
                    </div>
                </div>

                {error && (
                    <div className="glass border-red-500/50 p-3 rounded-lg">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-gradient h-12 rounded-xl text-base font-semibold disabled:opacity-50"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </Button>
            </form>

            <div className="relative text-center text-sm">
                <span className="text-muted-foreground">Don&apos;t have an account? </span>
                <Link href="/signup" className="gradient-text font-semibold hover:underline">
                    Sign up
                </Link>
            </div>
        </div>
    );
}
