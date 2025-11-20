/**
 * API Route: Initialize ID Counter System
 * 
 * Call this once to set up the ID counter in Firestore.
 * Protected endpoint - only for admin use.
 */

import { NextRequest, NextResponse } from "next/server";
import { initializeIdCounters } from "@/lib/idGenerator";

export async function POST(request: NextRequest) {
    try {
        // In production, add authentication here
        // For now, this is open but should be protected

        await initializeIdCounters();

        return NextResponse.json({
            success: true,
            message: "ID counter system initialized successfully",
        });
    } catch (error) {
        console.error("Error initializing ID counters:", error);

        if (error instanceof Error && error.message.includes("already initialized")) {
            return NextResponse.json({
                success: false,
                message: "ID counters already initialized",
            }, { status: 200 });
        }

        return NextResponse.json({
            error: "Failed to initialize ID counters",
            details: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 });
    }
}
