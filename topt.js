import { totp } from "otplib";
import pkg from "base32.js";
const { Encoder } = pkg;

export const generateTOTP= (HEX_SEED) => {
    try {
        if(!/^[0-9a-f]{64}$/i.test(HEX_SEED)) {
            console.log("Invalid HEX_SEED");
            return null;
        }

        const seedBytes = Buffer.from(HEX_SEED, "hex");
        const encoder = new Encoder({
            type: "rfc4648",
            lc: true
        });
        const base32Seed = encoder.write(seedBytes).finalize();

        totp.options = {
            digits: 6,
            step: 30,
            algorithm: "sha1",
        };

        return totp.generate(base32Seed);
    } catch(err) {
        console.log("Error generating TOTP", err);
        throw new Error("Generating TOTP");
    }
}

export const verifyTOTP = (HEX_SEED, code) => {
    try {
        if(!/^[0-9a-f]{64}$/i.test(HEX_SEED)) {
            console.log("Invalid HEX_SEED");
            return null;
        }
        const seedBytes = Buffer.from(HEX_SEED, "hex");

        const encoder = new Encoder({
            type: "rfc4648",
            lc: true
        });
        const base32Seed = encoder.write(seedBytes).finalize();

        totp.options = {
            digits: 6,
            step: 30,
            algorithm: "sha1",
        };

        return totp.check(code, base32Seed, {
            window: 1
        });
    } catch (err) {
        console.error("Error verifying TOTP", err);
        throw new Error("Error Verifying TOTP");
    }
}