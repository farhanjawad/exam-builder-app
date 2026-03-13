import fs from 'fs';
import path from 'path';

// Define the exact shape of your scraped question data
export interface Question {
    id: string; // We will generate this dynamically
    examSource: string; // To know which file it came from
    question_html: string;
    options_html: string[];
    correct_answer_html: string;
    solution_html: string;
}

// ⚠️ IMPORTANT: Update this to match your actual GitHub repository details!
const GITHUB_USERNAME = "YourInstitute";
const GITHUB_REPO = "ExamRepo";
const BRANCH = "main"; 
const CDN_BASE_URL = `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${GITHUB_REPO}@${BRANCH}/public/`;

/**
 * Replaces local image paths with the blazing-fast jsDelivr CDN paths.
 */
function injectCDN(htmlString: string): string {
    if (!htmlString) return "";
    // This looks for src="images/..." and swaps it to src="https://cdn.../public/images/..."
    return htmlString.replace(/src=["']images\//g, `src="${CDN_BASE_URL}images/`);
}

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