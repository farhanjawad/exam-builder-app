'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Question } from '../lib/dataFetcher';
import QuestionCard from './QuestionCard';

interface QuestionBankProps {
    onAddQuestion: (q: Question) => void;
    alreadyAddedIds: Set<string>;
}

export default function QuestionBank({ onAddQuestion, alreadyAddedIds }: QuestionBankProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch questions from our API endpoint
    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                // We add a limit initially to keep the browser snappy
                const url = searchQuery 
                    ? `/api/exams?search=${encodeURIComponent(searchQuery)}`
                    : `/api/exams?limit=50`;
                    
                const res = await fetch(url);
                const json = await res.json();
                if (json.success) {
                    setQuestions(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch questions", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce the search so it doesn't spam the API on every keystroke
        const timer = setTimeout(() => {
            fetchQuestions();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm no-print">
            {/* Sticky Search Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">📚</span> Question Bank
                </h2>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search by keyword, topic, or exam..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            {/* Scrollable Question List */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
                {loading ? (
                    <div className="flex justify-center items-center h-32 text-gray-400">
                        <Loader2 className="animate-spin mr-2" size={20} /> Loading database...
                    </div>
                ) : questions.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        No questions found matching "{searchQuery}"
                    </div>
                ) : (
                    questions.map((q) => (
                        <div key={q.id} className={alreadyAddedIds.has(q.id) ? "opacity-50 pointer-events-none" : ""}>
                            <QuestionCard 
                                question={q} 
                                mode="bank" 
                                onAdd={onAddQuestion} 
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}