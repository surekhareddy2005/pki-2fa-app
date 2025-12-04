import crypto from "crypto";
import fs from "fs";

const decryptSeed = async (encrypted_seed) => {
    try {
        const encryptedBuffer = Buffer.from(encrypted_seed.trim(), "base64");

        const privateKey = fs.readFileSync("./keys/student_private.pem", "utf8");

        const decryptedBuffer = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            encryptedBuffer
        );

        const seed = decryptedBuffer.toString("utf8");

        if (!/^[0-9a-f]{64}$/i.test(seed)) {
            console.log("Invalid seed format");
        }

        return seed;
    } catch (err) {
        console.error("Failed to decrypt seed:", err);
        throw err;
    }
};

const ENCRYPTED_SEED_PATH = "./keys/encrypted_seed.txt";
(async () => {
    const encrypted_seed = fs.readFileSync(ENCRYPTED_SEED_PATH, "utf8");
    const seed = await decryptSeed(encrypted_seed);
    fs.writeFileSync("./data/seed.txt", seed);
})();

export default decryptSeed;