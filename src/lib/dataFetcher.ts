import fs from 'fs';
import path from 'path';

export interface Question {
    id: string;
    examSource: string;
    question_html: string;
    options_html: string[];
    correct_answer_html: string;
    solution_html: string;
}

// Pull repository details from your .env.local file
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "UnknownUser";
const GITHUB_REPO = process.env.GITHUB_REPO || "UnknownRepo";
const BRANCH = process.env.GITHUB_BRANCH || "main"; 

// Construct the base CDN URL
// Format: https://cdn.jsdelivr.net/gh/user/repo@branch/public/
const CDN_BASE_URL = `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${GITHUB_REPO}@${BRANCH}/public/`;

/**
 * Intercepts the raw HTML and rewrites local image paths to use the jsDelivr CDN.
 */
function injectCDN(htmlString: string): string {
    if (!htmlString) return "";
    
    // In development mode (localhost), keep images local so you can test offline
    if (process.env.NODE_ENV === 'development') {
        // Just add a leading slash so Next.js knows to look in the /public folder
        return htmlString.replace(/src=["']images\//g, `src="/images/`);
    }

    // In production, swap local paths to the global CDN
    return htmlString.replace(/src=["']images\//g, `src="${CDN_BASE_URL}images/`);
}

// ... [The rest of your getAllQuestions() function remains exactly the same]

/**
 * Reads all JSON files from the local /data/ folder and compiles them into memory.
 */
export function getAllQuestions(): Question[] {
    const dataDirectory = path.join(process.cwd(), 'data');
    let allQuestions: Question[] = [];

    try {
        // 1. Read all files in the directory
        const filenames = fs.readdirSync(dataDirectory);

        // 2. Filter for just the .json files
        const jsonFiles = filenames.filter(file => file.endsWith('.json'));

        // 3. Loop through each file and parse the questions
        jsonFiles.forEach((file, fileIndex) => {
            const filePath = path.join(dataDirectory, file);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const examData = JSON.parse(fileContents);
            
            // Clean up the filename to use as a readable tag
            const examName = file.replace('.json', '').replace(/_/g, ' ');

            // 4. Inject IDs, attach the exam name, and swap image URLs to the CDN
            const processedQuestions = examData.map((q: any, qIndex: number) => ({
                id: `exam${fileIndex}_q${qIndex}`, // e.g., "exam0_q14"
                examSource: examName,
                question_html: injectCDN(q.question_html),
                options_html: q.options_html ? q.options_html.map((opt: string) => injectCDN(opt)) : [],
                correct_answer_html: injectCDN(q.correct_answer_html),
                solution_html: injectCDN(q.solution_html)
            }));

            allQuestions = [...allQuestions, ...processedQuestions];
        });

    } catch (error) {
        console.error("Error reading exam data:", error);
    }

    return allQuestions;
}