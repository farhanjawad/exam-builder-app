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

    const handleAddMultiple = (newQuestions: Question[]) => {
        setSelectedQuestions(prev => {
            const currentIds = new Set(prev.map(q => q.id));
            const uniqueNewQs = newQuestions.filter(q => !currentIds.has(q.id));
            return [...prev, ...uniqueNewQs];
        });
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
        <div className="flex h-screen w-full text-neutral-950 overflow-hidden">
            <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
                <div className="w-full md:w-100 lg:w-112.5 ...">
                    <QuestionBank
                        onAddQuestion={handleAddQuestion}
                        onAddMultiple={handleAddMultiple}
                        alreadyAddedIds={alreadyAddedIds}
                    />
                </div>

                <div className="flex-1 h-full relative">
                    <PaperCanvas
                        selectedQuestions={selectedQuestions}
                        onRemoveQuestion={handleRemoveQuestion}
                        examTitle=""
                        setExamTitle={() => {}}
                        duration=""
                        setDuration={() => {}}
                        marks=""
                        setMarks={() => {}}

                        onReorder={handleReorder}
                    />
                </div>
            </div>
        </div>
    );
}