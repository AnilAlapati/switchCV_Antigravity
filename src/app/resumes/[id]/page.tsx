import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ResumeView from "@/components/features/ResumeView";
import { notFound } from "next/navigation";

// This is a server component
export default async function PublicResumePage({ params }: { params: { id: string } }) {
    // Note: In a real app with Firebase Client SDK, we might fetch on client or use Admin SDK on server.
    // Since we are using Client SDK, we should probably make this a Client Component or fetch in useEffect.
    // However, for SEO and initial load, Server Component is better.
    // But Firebase Client SDK isn't great in Server Components without some workarounds.
    // For simplicity in this demo, let's make it a Client Component that fetches data.

    return <ResumeFetcher id={params.id} />;
}

import ResumeFetcher from "./ResumeFetcher";
