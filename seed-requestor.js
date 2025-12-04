import axios from 'axios';
import fs from 'fs';
import 'dotenv/config';


const PUBLIC_KEY = fs.readFileSync("./keys/student_public.pem", "utf8");
const STUDENT_ID = process.env.STUDENT_ID;
const GITHUB_REPO_URL = process.env.GITHUB_REPO_URL;
const INSTRUCTOR_API_ENDPOINT = process.env.INSTRUCTOR_API_ENDPOINT;

const getInstructorSeed = async () => {
    try {
        const res = await axios.post(INSTRUCTOR_API_ENDPOINT, {
            "student_id": STUDENT_ID,
            "github_repo_url": GITHUB_REPO_URL,
            "public_key": PUBLIC_KEY,
        });
        fs.writeFileSync("./keys/encrypted_seed.txt", res.data.encrypted_seed);
        console.log("Encrypted seed collected from Instructor API ENDPOINT");
    } catch(err) {
        console.log("Error: getInstructorSeed error: " + err);
    }
}

await getInstructorSeed();

export default getInstructorSeed;