import { totp } from "otplib";

totp.options = {
    digits: 6,
    step: 30,
    algorithm: "sha1",
    encoding: "hex",
};

export const generateTOTP = (HEX_SEED) => {
    if (!/^[0-9a-f]{64}$/i.test(HEX_SEED)) {
        throw new Error("Invalid HEX seed");
    }

    return totp.generate(HEX_SEED);
};

export const verifyTOTP = (HEX_SEED, code) => {
    if (!/^[0-9a-f]{64}$/i.test(HEX_SEED)) {
        throw new Error("Invalid HEX seed");
    }

    return totp.check(code, HEX_SEED, { window: 1 });
};