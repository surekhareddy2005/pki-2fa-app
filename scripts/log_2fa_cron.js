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

const timestamp = new Date().toISOString().replace("T", " ").replace("Z", "");

console.log(`${timestamp} - 2FA Code: ${code}`);