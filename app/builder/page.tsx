'use client';

import { useState } from 'react';
import { Question } from '../../src/lib/dataFetcher';
import QuestionBank from '../../src/components/QuestionBank';
import PaperCanvas from '../../src/components/PaperCanvas';

export default function BuilderPage() {
    // This is the master state holding the current exam paper
    const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

    // Handler to push a new question into the exam
    const handleAddQuestion = (question: Question) => {
        // Double-check to prevent duplicates
        if (!selectedQuestions.find(q => q.id === question.id)) {
            setSelectedQuestions(prev => [...prev, question]);
        }
    };

    // Handler to remove a question from the exam
    const handleRemoveQuestion = (id: string) => {
        setSelectedQuestions(prev => prev.filter(q => q.id !== id));
    };

    // Handler for reordering (ready for future drag-and-drop implementation)
    const handleReorder = (dragIndex: number, hoverIndex: number) => {
        setSelectedQuestions(prev => {
            const updated = [...prev];
            const [movedItem] = updated.splice(dragIndex, 1);
            updated.splice(hoverIndex, 0, movedItem);
            return updated;
        });
    };

    // Create a Set of already added IDs for O(1) fast lookup in the QuestionBank
    const alreadyAddedIds = new Set(selectedQuestions.map(q => q.id));

    return (
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
            
            {/* Left Pane: Question Bank (Hidden automatically when printing) */}
            <div className="w-full md:w-100 lg:w-112.5 shrink-0 h-full border-r border-gray-200 shadow-[2px_0_8px_rgba(0,0,0,0.05)] z-10 no-print transition-all">
                <QuestionBank 
                    onAddQuestion={handleAddQuestion} 
                    alreadyAddedIds={alreadyAddedIds} 
                />
            </div>

            {/* Right Pane: The Exam Canvas */}
            <div className="flex-1 h-full relative">
                <PaperCanvas 
                    selectedQuestions={selectedQuestions} 
                    onRemoveQuestion={handleRemoveQuestion}
                    onReorder={handleReorder}
                />
            </div>
            
        </div>
    );
}