/**
 * Initialize ID Counter System
 * 
 * Run this script once to set up the distributed counter system in Firestore.
 * 
 * Usage:
 *   npm run init-counters
 */

// Import Firebase Admin SDK for server-side initialization
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Configuration
const NUM_SHARDS = 50;
const MAX_NUMERIC_ID = 99999999;

async function initializeCounters() {
    try {
        console.log("🚀 Initializing ID Counter System...\n");

        // Initialize Firebase Admin
        if (getApps().length === 0) {
            // Check if we have service account credentials
            const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

            if (serviceAccount) {
                initializeApp({
                    credential: cert(JSON.parse(serviceAccount)),
                });
            } else {
                // Use default credentials or environment variables
                initializeApp({
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                });
            }
        }

        const db = getFirestore();

        // Check if counter already exists
        const counterRef = db.collection("system").doc("id_counter");
        const counterDoc = await counterRef.get();

        if (counterDoc.exists) {
            console.log("⚠️  ID counter already initialized!");
            console.log("\nCurrent state:");
            const data = counterDoc.data();
            console.log(`  Total Assigned: ${data?.totalAssigned || 0}`);
            console.log(`  Numeric Exhausted: ${data?.numericExhausted || false}`);
            console.log(`  Number of Shards: ${Object.keys(data?.shards || {}).length}`);

            const response = await promptUser("\nDo you want to reset the counter? (yes/no): ");
            if (response.toLowerCase() !== "yes") {
                console.log("\n✅ Keeping existing counter. Exiting...");
                process.exit(0);
            }
        }

        // Initialize shards
        console.log(`📊 Creating ${NUM_SHARDS} counter shards...`);
        const shards: Record<string, number> = {};
        for (let i = 0; i < NUM_SHARDS; i++) {
            shards[i.toString()] = 0;
        }

        // Create/update the counter document
        await counterRef.set({
            shards,
            numericExhausted: false,
            totalAssigned: 0,
            maxNumeric: MAX_NUMERIC_ID,
            alphanumericCounter: 0,
            lastUpdated: new Date(),
            createdAt: new Date(),
        });

        console.log("\n✅ ID Counter System initialized successfully!");
        console.log("\nConfiguration:");
        console.log(`  Number of Shards: ${NUM_SHARDS}`);
        console.log(`  Max Numeric ID: ${MAX_NUMERIC_ID.toLocaleString()}`);
        console.log(`  Initial State: 0 IDs assigned`);
        console.log("\n🎉 System is ready to assign IDs!");

    } catch (error) {
        console.error("\n❌ Error initializing counters:", error);
        process.exit(1);
    }
}

// Helper function to prompt user input
function promptUser(question: string): Promise<string> {
    const readline = require("readline");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer: string) => {
            rl.close();
            resolve(answer);
        });
    });
}

// Run the initialization
initializeCounters();
