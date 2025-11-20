/**
 * API Route: Reserve Resume ID
 * 
 * This endpoint reserves a sequential ID for a new resume.
 * Called before creating a resume to ensure proper ID assignment.
 */

import { NextRequest, NextResponse } from "next/server";
import { reserveResumeId } from "@/lib/idGenerator";

// Rate limiting configuration (simple in-memory implementation)
// In production, use Redis or a proper rate limiting service
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

/**
 * Simple rate limiter
 */
function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    if (!record || now > record.resetTime) {
        // New window
        rateLimitMap.set(identifier, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW,
        });
        return { allowed: true };
    }

    if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        return { allowed: false, retryAfter };
    }

    record.count++;
    return { allowed: true };
}

/**
 * POST /api/reserve-id
 * Reserves the next available resume ID
 */
export async function POST(request: NextRequest) {
    try {
        // Get client identifier (IP address or user ID)
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";

        // Check rate limit
        const rateLimitResult = checkRateLimit(ip);
        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                {
                    error: "Too many requests",
                    retryAfter: rateLimitResult.retryAfter,
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After": rateLimitResult.retryAfter?.toString() || "60",
                    },
                }
            );
        }

        // Reserve the ID
        const reservedId = await reserveResumeId();

        return NextResponse.json(
            {
                success: true,
                id: reservedId,
                message: "ID reserved successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error reserving ID:", error);

        // Handle specific errors
        if (error instanceof Error) {
            if (error.message.includes("not initialized")) {
                return NextResponse.json(
                    {
                        error: "ID system not initialized",
                        message: "Please contact support",
                    },
                    { status: 500 }
                );
            }

            if (error.message.includes("Failed to assign")) {
                return NextResponse.json(
                    {
                        error: "ID assignment failed",
                        message: "High server load, please retry",
                    },
                    { status: 503 }
                );
            }
        }

        return NextResponse.json(
            {
                error: "Internal server error",
                message: "Failed to reserve ID",
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/reserve-id/stats
 * Get statistics about ID assignment (for admin/monitoring)
 */
export async function GET(request: NextRequest) {
    try {
        const { getIdStatistics } = await import("@/lib/idGenerator");
        const stats = await getIdStatistics();

        return NextResponse.json({
            success: true,
            statistics: stats,
        });
    } catch (error) {
        console.error("Error getting ID statistics:", error);
        return NextResponse.json(
            {
                error: "Failed to retrieve statistics",
            },
            { status: 500 }
        );
    }
}
