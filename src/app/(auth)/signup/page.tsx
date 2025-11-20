"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await createUserWithEmailAndPassword(auth, email, password);
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
        <div className="glass-dark p-8 rounded-xl space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tighter">Create Account</h1>
                <p className="text-muted-foreground">Enter your details to get started</p>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background/50"
                    />
                </div>
                <div className="space-y-2">
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background/50"
                    />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" loading={loading}>
                    Sign Up
                </Button>
            </form>
            <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="text-primary hover:underline">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
