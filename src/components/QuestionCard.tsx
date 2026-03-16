'use client';

import { useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Question } from '../lib/dataFetcher';

declare global {
    interface Window {
        MathJax?: any;
    }
}

interface QuestionCardProps {
    question: Question;
    mode: 'bank' | 'canvas';
    onAdd?: (q: Question) => void;
    onRemove?: (id: string) => void;
}

export default function QuestionCard({ question, mode, onAdd, onRemove }: QuestionCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    // This hook fires every time the component renders on the screen
    useEffect(() => {
        // @ts-ignore - MathJax is injected globally via the layout
        if (typeof window !== 'undefined' && window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([cardRef.current]).catch((err: any) => 
                console.error("MathJax rendering error: ", err)
            );
        }
    }, [question]);

    return (
        <div 
            ref={cardRef} 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4 relative avoid-page-break transition-all hover:shadow-md"
        >
            {/* Header & Action Button */}
            <div className="flex justify-between items-start mb-4 no-print">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded">
                    {question.examSource}
                </span>
                
                {mode === 'bank' && onAdd && (
                    <button 
                        onClick={() => onAdd(question)} 
                        className="p-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-600 hover:text-white transition-colors"
                        title="Add to Exam"
                    >
                        <Plus size={18} />
                    </button>
                )}
                
                {mode === 'canvas' && onRemove && (
                    <button 
                        onClick={() => onRemove(question.id)} 
                        className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-600 hover:text-white transition-colors"
                        title="Remove from Exam"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            {/* Main Question Text */}
            <div 
                className="text-lg mb-5 text-gray-800" 
                dangerouslySetInnerHTML={{ __html: question.question_html }} 
            />

            {/* Options Grid */}
            {question.options_html && question.options_html.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-gray-950">
                    {question.options_html.map((opt, idx) => (
                        <div key={idx} className="flex items-start bg-black-500 p-3 rounded border border-gray-100">
                            <span className="font-bold mr-3 text-gray-500 mt-1">
                                {String.fromCharCode(65 + idx)}.
                            </span>
                            <div className="w-full" dangerouslySetInnerHTML={{ __html: opt }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Solution & Correct Answer (Hidden by default during print via CSS) */}
            <div className="mt-6 pt-4 border-t border-dashed border-gray-200 solution-block">
                {question.correct_answer_html && (
                    <div className="text-green-700 mb-3 flex items-start">
                        <span className="mr-2 mt-1">✔️</span> 
                        <div>
                            <span className="font-bold text-sm uppercase tracking-wide mr-2">Correct Answer:</span>
                            <div dangerouslySetInnerHTML={{ __html: question.correct_answer_html }} />
                        </div>
                    </div>
                )}
                
                {question.solution_html && (
                    <div className="bg-[#f8fff9] p-4 rounded-r border-l-4 border-green-500 mt-3">
                        <span className="font-bold text-green-700 text-sm uppercase tracking-wide block mb-2">
                            Solution:
                        </span>
                        <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: question.solution_html }} />
                    </div>
                )}
            </div>
        </div>
    );
}