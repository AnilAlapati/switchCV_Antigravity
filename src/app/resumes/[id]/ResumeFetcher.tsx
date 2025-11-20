"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ResumeView, { ResumeData } from "@/components/features/ResumeView";
import { Loader2 } from "lucide-react";

export default function ResumeFetcher({ id }: { id: string }) {
    const [data, setData] = useState<ResumeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const docRef = doc(db, "resumes", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setData(docSnap.data() as ResumeData);
                } else {
                    setError(true);
                }
            } catch (e) {
                console.error("Error fetching resume:", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted-foreground">
                Resume not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            <ResumeView data={data} />
        </div>
    );
}
