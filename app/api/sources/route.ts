import { NextResponse } from 'next/server';
import { getAllQuestions } from '../../../src/lib/dataFetcher';

export async function GET() {
    try {
        const questions = getAllQuestions();
        // Extract unique exam names and sort them alphabetically
        const uniqueSources = Array.from(new Set(questions.map(q => q.examSource))).sort();
        
        return NextResponse.json({ 
            success: true, 
            data: uniqueSources 
        }, { status: 200 });
        
    } catch (error) {
        console.error("API Error fetching sources:", error);
        return NextResponse.json({ 
            success: false, 
            error: "Failed to load exam sources" 
        }, { status: 500 });
    }
}