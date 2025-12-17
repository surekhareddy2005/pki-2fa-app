#!/usr/local/bin/node

import fs from "fs";
import { generateTOTP } from "../topt.js";

const SEED_PATH = "/data/seed.txt";

let SEED = "";
try {
    SEED = fs.readFileSync(SEED_PATH, "utf-8").trim();
} catch (e) {
    console.error("Seed file not found at /data/seed.txt");
    process.exit(0);
}

let code;
try {
    code = generateTOTP(SEED);
} catch (err) {
    console.log("Failed to generate TOTP:", err.message);
    process.exit(0);
}

// Get current timestamp and format it as 'YYYY-MM-DD HH:MM:SS'
const timestamp = new Date();
const formattedTimestamp = timestamp.toISOString().split('T')[0] + " " + timestamp.toISOString().split('T')[1].split('.')[0];

console.log(`${formattedTimestamp} - 2FA Code: ${code}`);