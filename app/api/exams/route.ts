import { NextResponse } from 'next/server';
import { getAllQuestions } from '../../../src/lib/dataFetcher';

export async function GET(request: Request) {
    try {
        const questions = getAllQuestions();
        const { searchParams } = new URL(request.url);
        
        const limit = searchParams.get('limit');
        const search = searchParams.get('search');
        const source = searchParams.get('source'); // NEW: The specific JSON file name

        let filteredQuestions = questions;

        // 1. If an exact JSON file is requested, filter for it first
        if (source) {
            filteredQuestions = filteredQuestions.filter(q => q.examSource === source);
        }

        // 2. Standard keyword search
        if (search) {
            const query = search.toLowerCase();
            filteredQuestions = filteredQuestions.filter(q => 
                q.question_html.toLowerCase().includes(query) ||
                q.examSource.toLowerCase().includes(query)
            );
        }

        // 3. Apply a limit ONLY if we aren't loading a full specific exam
        if (limit && !source) {
            filteredQuestions = filteredQuestions.slice(0, parseInt(limit, 10));
        }

        return NextResponse.json({ 
            success: true, 
            total: filteredQuestions.length,
            data: filteredQuestions 
        }, { status: 200 });

    } catch (error) {
        console.error("API Error fetching questions:", error);
        return NextResponse.json({ success: false, error: "Failed to load questions" }, { status: 500 });
    }
}