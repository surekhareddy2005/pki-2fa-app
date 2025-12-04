import {generateKeyPairSync} from 'crypto';
import fs from 'fs';

(() => {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicExponent: 0x10001,
        publicKeyEncoding: {
            type: "spki",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem"
        }
    });

    fs.writeFileSync("./keys/student_public.pem", publicKey);
    fs.writeFileSync("./keys/student_private.pem", privateKey);

    console.log("Generated Student key pair");
})();