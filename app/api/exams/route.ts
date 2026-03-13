import { NextResponse } from 'next/server';
import { getAllQuestions } from '../../../src/lib/dataFetcher';

export async function GET(request: Request) {
    try {
        // 1. Fetch all questions from our local JSON files using the data engine
        const questions = getAllQuestions();

        // 2. Grab search parameters from the URL
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit');
        const search = searchParams.get('search');

        let filteredQuestions = questions;

        // 3. Apply search filtering (looks through question text and the exam source name)
        if (search) {
            const query = search.toLowerCase();
            filteredQuestions = filteredQuestions.filter(q => 
                q.question_html.toLowerCase().includes(query) ||
                q.examSource.toLowerCase().includes(query)
            );
        }

        // 4. Apply a limit to prevent overloading the browser (useful for initial loads)
        if (limit) {
            filteredQuestions = filteredQuestions.slice(0, parseInt(limit, 10));
        }

        // 5. Return the clean data to the frontend
        return NextResponse.json({ 
            success: true, 
            total: filteredQuestions.length,
            data: filteredQuestions 
        }, { status: 200 });

    } catch (error) {
        console.error("API Error fetching questions:", error);
        return NextResponse.json({ 
            success: false, 
            error: "Failed to load questions" 
        }, { status: 500 });
    }
}