import express from "express";
import 'dotenv/config';
import fs from "fs";

import decryptSeed from "./decrypt-seed.js";
import { generateTOTP, verifyTOTP } from "./topt.js";

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static("public"));

const PRIVATE_KEY = fs.readFileSync('./keys/student_private.pem', 'utf8');

server.get('/', (req, res) => {
    res.status(200).json({
        developer: "Surekha Reddy",
        project_name: "Build Secure PKI-Based 2FA Microservice with Docker",
        status: "Running",
        available_routes: [
            "GET /health",
            "POST /decrypt-seed",
            "GET /generate-2fa",
            "POST /verify-2fa",
        ],
        created_at: "04-12-2025"
    })
})

server.get('/health', (req, res) => {
    return res.status(200).send({
        status: "ok",
    })
})

server.post('/decrypt-seed', async (req, res) => {
    try {
        const { encrypted_seed } = req.body;
        const seed = await decryptSeed(encrypted_seed);
        fs.writeFileSync('/data/seed.txt', seed);
        console.log("Seed successfully written to " + JSON.stringify(seed));
        return res.status(200).json({
            status: "ok"
        })
    } catch(err) {
        console.log("Error creating decrypt seed:", err);
        return res.status(500).json({
            error: "Seed not decrypted yet"
        })
    }
})

server.get('/generate-2fa', async (req, res) => {
    try {
        const SEED = fs.readFileSync('/data/seed.txt', 'utf8').trim()
        const code = generateTOTP(SEED);
        return res.status(200).json({
            code: code,
            valid_for: 30
        });
    } catch (err) {
        console.error("Failed to generate a seed:", err);
        return res.status(500).json({
            error: "Seed not decrypted yet"
        })
    }
})

server.post('/verify-2fa', async (req, res) => {
    try {
        if(!req.body) {
            return res.status(400).json({
                error: "Missing code"
            })
        }
        const SEED = fs.readFileSync('/data/seed.txt', 'utf8').trim()
        const { code } = req.body;
        if(!code || code === "") {
            return res.status(400).json({
                error: "Missing code"
            })
        }

        const isValid = verifyTOTP(SEED, code);
        return res.status(200).json({
            valid: isValid,
        })
    } catch (err) {
        console.log("Error verifying Code:", err);
        return res.status(500).json({
            error: "Seed not decrypted yet"
        })
    }
})

server.listen(8080, () => {
    console.log("Listening on port 8080");
});
