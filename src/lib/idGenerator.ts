/**
 * Distributed Sequential ID Generator for SwitchCV
 * 
 * Generates sequential numeric IDs (1-99999999) using a sharded counter approach.
 * Switches to alphanumeric IDs when numeric pool is exhausted.
 * 
 * Handles millions of concurrent requests through:
 * - Distributed sharded counters (reduces contention)
 * - Optimistic transaction retries
 * - Collision detection and recovery
 */

import { db } from "./firebase";
import {
    doc,
    getDoc,
    setDoc,
    runTransaction,
    collection,
    query,
    where,
    getDocs,
    writeBatch,
} from "firebase/firestore";

// Configuration
const NUM_SHARDS = 50; // Number of counter shards for distributed writes
const MAX_NUMERIC_ID = 99999999; // 8-digit maximum
const MAX_RETRIES = 5; // Max transaction retry attempts
const ALPHANUMERIC_LENGTH = 6; // Length of alphanumeric IDs

// Base62 characters (a-z, A-Z, 0-9) - 62 total
const BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Initialize the ID counter system with shards
 * Call this once during setup
 */
export async function initializeIdCounters(): Promise<void> {
    const counterRef = doc(db, "system", "id_counter");

    const snapshot = await getDoc(counterRef);
    if (snapshot.exists()) {
        console.log("ID counter already initialized");
        return;
    }

    // Initialize with shards
    const shards: Record<string, number> = {};
    for (let i = 0; i < NUM_SHARDS; i++) {
        shards[i.toString()] = 0;
    }

    await setDoc(counterRef, {
        shards,
        numericExhausted: false,
        totalAssigned: 0,
        maxNumeric: MAX_NUMERIC_ID,
        lastUpdated: new Date(),
    });

    console.log(`Initialized ID counter with ${NUM_SHARDS} shards`);
}

/**
 * Get the next available ID (numeric or alphanumeric)
 */
export async function getNextResumeId(): Promise<string> {
    const counterRef = doc(db, "system", "id_counter");

    // Check if numeric IDs are exhausted
    const snapshot = await getDoc(counterRef);
    if (!snapshot.exists()) {
        throw new Error("ID counter not initialized. Run initializeIdCounters() first.");
    }

    const data = snapshot.data();
    if (data.numericExhausted) {
        return await getNextAlphanumericId();
    }

    // Try to get a numeric ID
    try {
        return await getNextNumericId();
    } catch (error) {
        // If numeric IDs exhausted during assignment, switch to alphanumeric
        if (error instanceof Error && error.message.includes("exhausted")) {
            return await getNextAlphanumericId();
        }
        throw error;
    }
}

/**
 * Get next numeric ID using distributed sharded counter
 */
async function getNextNumericId(): Promise<string> {
    const counterRef = doc(db, "system", "id_counter");

    // Select a random shard to reduce contention
    const shardId = Math.floor(Math.random() * NUM_SHARDS).toString();

    let attempts = 0;
    while (attempts < MAX_RETRIES) {
        try {
            const nextId = await runTransaction(db, async (transaction) => {
                const counterDoc = await transaction.get(counterRef);

                if (!counterDoc.exists()) {
                    throw new Error("Counter not initialized");
                }

                const data = counterDoc.data();

                // Check if we've exhausted numeric IDs
                if (data.numericExhausted || data.totalAssigned >= MAX_NUMERIC_ID) {
                    // Mark as exhausted
                    transaction.update(counterRef, { numericExhausted: true });
                    throw new Error("Numeric IDs exhausted");
                }

                // Increment the shard count
                const currentShardCount = data.shards[shardId] || 0;
                const newShardCount = currentShardCount + 1;
                const newTotal = data.totalAssigned + 1;

                // Calculate the actual ID based on total assigned
                const nextNumericId = newTotal;

                // Double-check we're not exceeding the limit
                if (nextNumericId > MAX_NUMERIC_ID) {
                    transaction.update(counterRef, { numericExhausted: true });
                    throw new Error("Numeric IDs exhausted");
                }

                // Update the counter
                transaction.update(counterRef, {
                    [`shards.${shardId}`]: newShardCount,
                    totalAssigned: newTotal,
                    lastUpdated: new Date(),
                });

                return nextNumericId.toString();
            });

            // Verify the ID doesn't exist (collision check)
            const resumeRef = doc(db, "resumes", nextId);
            const resumeSnap = await getDoc(resumeRef);

            if (resumeSnap.exists()) {
                // Collision detected (rare), retry
                console.warn(`ID collision detected for ${nextId}, retrying...`);
                attempts++;
                continue;
            }

            return nextId;
        } catch (error) {
            if (error instanceof Error && error.message.includes("exhausted")) {
                throw error; // Propagate exhaustion error
            }

            // Transaction contention, retry with exponential backoff
            attempts++;
            if (attempts >= MAX_RETRIES) {
                throw new Error(`Failed to assign ID after ${MAX_RETRIES} attempts`);
            }

            // Exponential backoff: 50ms, 100ms, 200ms, 400ms, 800ms
            await new Promise(resolve => setTimeout(resolve, 50 * Math.pow(2, attempts - 1)));
        }
    }

    throw new Error("Failed to generate numeric ID");
}

/**
 * Get next alphanumeric ID
 * Uses base62 encoding for compact IDs
 */
async function getNextAlphanumericId(): Promise<string> {
    const counterRef = doc(db, "system", "id_counter");

    let attempts = 0;
    while (attempts < MAX_RETRIES) {
        try {
            const nextId = await runTransaction(db, async (transaction) => {
                const counterDoc = await transaction.get(counterRef);

                if (!counterDoc.exists()) {
                    throw new Error("Counter not initialized");
                }

                const data = counterDoc.data();

                // Get alphanumeric counter (starts after numeric IDs)
                const alphaCounter = data.alphanumericCounter || 0;
                const nextAlphaCounter = alphaCounter + 1;

                // Convert to base62
                const alphaId = numberToBase62(nextAlphaCounter, ALPHANUMERIC_LENGTH);

                // Update counter
                transaction.update(counterRef, {
                    alphanumericCounter: nextAlphaCounter,
                    lastUpdated: new Date(),
                });

                return alphaId;
            });

            // Verify the ID doesn't exist
            const resumeRef = doc(db, "resumes", nextId);
            const resumeSnap = await getDoc(resumeRef);

            if (resumeSnap.exists()) {
                console.warn(`Alphanumeric ID collision for ${nextId}, retrying...`);
                attempts++;
                continue;
            }

            return nextId;
        } catch (error) {
            attempts++;
            if (attempts >= MAX_RETRIES) {
                throw new Error(`Failed to assign alphanumeric ID after ${MAX_RETRIES} attempts`);
            }

            await new Promise(resolve => setTimeout(resolve, 50 * Math.pow(2, attempts - 1)));
        }
    }

    throw new Error("Failed to generate alphanumeric ID");
}

/**
 * Convert number to base62 string
 */
function numberToBase62(num: number, minLength: number = ALPHANUMERIC_LENGTH): string {
    if (num === 0) return BASE62_CHARS[0].repeat(minLength);

    let result = "";
    let n = num;

    while (n > 0) {
        result = BASE62_CHARS[n % 62] + result;
        n = Math.floor(n / 62);
    }

    // Pad with leading zeros to ensure minimum length
    while (result.length < minLength) {
        result = BASE62_CHARS[0] + result;
    }

    return result;
}

/**
 * Convert base62 string back to number (for reference)
 */
function base62ToNumber(str: string): number {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str[str.length - 1 - i];
        const value = BASE62_CHARS.indexOf(char);
        result += value * Math.pow(62, i);
    }
    return result;
}

/**
 * Get statistics about ID assignment
 */
export async function getIdStatistics(): Promise<{
    totalAssigned: number;
    numericRemaining: number;
    numericExhausted: boolean;
    shardDistribution: Record<string, number>;
}> {
    const counterRef = doc(db, "system", "id_counter");
    const snapshot = await getDoc(counterRef);

    if (!snapshot.exists()) {
        throw new Error("Counter not initialized");
    }

    const data = snapshot.data();

    return {
        totalAssigned: data.totalAssigned || 0,
        numericRemaining: MAX_NUMERIC_ID - (data.totalAssigned || 0),
        numericExhausted: data.numericExhausted || false,
        shardDistribution: data.shards || {},
    };
}

/**
 * Reserve a resume ID and return it
 * This is the main function to call when creating a new resume
 */
export async function reserveResumeId(): Promise<string> {
    return await getNextResumeId();
}
