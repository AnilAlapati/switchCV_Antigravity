/**
 * Client-side ID counter initialization
 * 
 * Alternative to the Admin SDK script for simpler setup.
 * Can be called from a Next.js API route or directly from client if needed.
 */

import { initializeIdCounters } from "./idGenerator";

/**
 * Initialize the ID counter system
 * Call this once during app setup
 */
export async function setupIdSystem() {
    try {
        await initializeIdCounters();
        console.log("✅ ID system initialized successfully");
        return { success: true };
    } catch (error) {
        console.error("❌ Failed to initialize ID system:", error);
        return { success: false, error };
    }
}
