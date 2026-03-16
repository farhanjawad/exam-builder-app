'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Book, CheckSquare } from 'lucide-react';
import { Question } from '../lib/dataFetcher';
import QuestionCard from './QuestionCard';

interface QuestionBankProps {
    onAddQuestion: (q: Question) => void;
    onAddMultiple?: (qs: Question[]) => void; // New prop for bulk addition
    alreadyAddedIds: Set<string>;
}

export default function QuestionBank({ onAddQuestion, onAddMultiple, alreadyAddedIds }: QuestionBankProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [sources, setSources] = useState<string[]>([]);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSource, setSelectedSource] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch the list of unique JSON files on initial load
    useEffect(() => {
        fetch('/api/sources')
            .then(res => res.json())
            .then(data => {
                if (data.success) setSources(data.data);
            })
            .catch(err => console.error("Failed to load sources", err));
    }, []);

    // Fetch questions based on search OR selected source
    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                let url = `/api/exams?limit=200`;
                
                if (selectedSource) {
                    url = `/api/exams?source=${encodeURIComponent(selectedSource)}`;
                } else if (searchQuery) {
                    url = `/api/exams?search=${encodeURIComponent(searchQuery)}`;
                }
                    
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

        const timer = setTimeout(fetchQuestions, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedSource]);

    // Handle Bulk Add
    const handleAddAll = () => {
        const unaddedQuestions = questions.filter(q => !alreadyAddedIds.has(q.id));
        if (onAddMultiple) {
            onAddMultiple(unaddedQuestions);
        } else {
            // Fallback if bulk prop isn't passed
            unaddedQuestions.forEach(q => onAddQuestion(q));
        }
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm no-print">
            
            {/* Control Panel */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-10 space-y-3">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <Book className="mr-2 text-blue-600" size={20} /> Question Bank
                </h2>
                
                {/* Exam Source Dropdown */}
                <select 
                    value={selectedSource}
                    onChange={(e) => {
                        setSelectedSource(e.target.value);
                        setSearchQuery(''); // Clear search when selecting an exam
                    }}
                    className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                >
                    <option value="">-- Browse all questions --</option>
                    {sources.map(src => (
                        <option key={src} value={src}>{src}</option>
                    ))}
                </select>

                {/* Keyword Search */}
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder={selectedSource ? "Search disabled while viewing full exam" : "Search keywords..."}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setSelectedSource(''); // Clear source when typing a search
                        }}
                        disabled={!!selectedSource}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>

                {/* Bulk Add Button (Only shows when a specific exam is selected) */}
                {selectedSource && questions.length > 0 && (
                    <button 
                        onClick={handleAddAll}
                        className="w-full flex items-center justify-center py-2 bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white rounded-md transition-colors font-semibold text-sm mt-2"
                    >
                        <CheckSquare size={16} className="mr-2" />
                        Add {questions.length} Questions to Paper
                    </button>
                )}
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
                {loading ? (
                    <div className="flex justify-center items-center h-32 text-gray-400">
                        <Loader2 className="animate-spin mr-2" size={20} /> Loading...
                    </div>
                ) : questions.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10 text-sm">
                        No questions found.
                    </div>
                ) : (
                    questions.map((q) => (
                        <div key={q.id} className={alreadyAddedIds.has(q.id) ? "opacity-50 pointer-events-none" : ""}>
                            <QuestionCard question={q} mode="bank" onAdd={onAddQuestion} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}