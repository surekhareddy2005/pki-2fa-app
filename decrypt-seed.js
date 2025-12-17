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

export default decryptSeed;