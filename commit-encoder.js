import fs from "fs";
import crypto from "crypto";
import { execSync } from "child_process";

const STUDENT_PRIVATE_KEY_PATH = "./keys/student_private.pem";
const INSTRUCTOR_PUBLIC_KEY_PATH = "./keys/instructor_public.pem";

function getLatestCommitHash() {
    try {
        const hash = execSync("git log -1 --format=%H", {
            encoding: "utf8",
        }).trim();

        if (!/^[0-9a-f]{40}$/i.test(hash)) {
            throw new Error(`Invalid commit hash: ${hash}`);
        }

        return hash;
    } catch (err) {
        console.error("Failed to get git commit hash. Are you in a git repo?");
        throw err;
    }
}

function signMessage(message, privateKeyPem) {
    const messageBuffer = Buffer.from(message, "utf8"); // CRITICAL: ASCII/UTF-8 bytes

    const signature = crypto.sign("sha256", messageBuffer, {
        key: privateKeyPem,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN, // max salt length
    });

    return signature; // Buffer
}

function encryptWithPublicKey(dataBuffer, publicKeyPem) {
    const encrypted = crypto.publicEncrypt(
        {
            key: publicKeyPem,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        dataBuffer
    );

    return encrypted;
}

function main() {
    try {
        const commitHash = getLatestCommitHash();
        console.log("Commit Hash:", commitHash);

        const studentPrivateKey = fs.readFileSync(STUDENT_PRIVATE_KEY_PATH, "utf8");

        const signature = signMessage(commitHash, studentPrivateKey);

        const instructorPublicKey = fs.readFileSync(INSTRUCTOR_PUBLIC_KEY_PATH, "utf8");

        const encryptedSignature = encryptWithPublicKey(signature, instructorPublicKey);

        const encryptedSignatureB64 = encryptedSignature.toString("base64");

        console.log("\n=== COMMIT PROOF ===");
        console.log("Commit Hash:");
        console.log(commitHash);
        console.log("\nEncrypted Signature (Base64):");
        console.log(encryptedSignatureB64);

        fs.writeFileSync(
            "./final-commit-metadata.txt",
            `Commit Hash: ${commitHash}\nEncryptedSignature: ${encryptedSignatureB64}\n`,
            "utf8"
        );

    } catch (err) {
        console.error("Failed to generate commit proof:", err);
        process.exit(1);
    }
}

main();
