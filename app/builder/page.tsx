'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Question } from '../../src/lib/dataFetcher';
import QuestionBank from '../../src/components/QuestionBank';
import PaperCanvas from '../../src/components/PaperCanvas';
import { Loader2 } from 'lucide-react';

// Extend the core Question type to support custom headers locally
export type WorkspaceQuestion = Question & { sectionTitle?: string };

function BuilderContent() {
    const searchParams = useSearchParams();
    const draftId = searchParams.get('draft');

    // Master Editable Header State
    const [examTitle, setExamTitle] = useState("গুচ্ছ মডেল টেস্ট");
    const [duration, setDuration] = useState("৫৫ মিনিট");
    const [marks, setMarks] = useState("১০০");

    const [selectedQuestions, setSelectedQuestions] = useState<WorkspaceQuestion[]>([]);
    const [isLoadingDraft, setIsLoadingDraft] = useState(false);

    // Fetch the draft from Firebase if a draft ID is in the URL
    useEffect(() => {
        const loadDraft = async () => {
            if (!draftId) return;
            
            setIsLoadingDraft(true);
            try {
                const draftRes = await fetch(`/api/drafts?id=${draftId}`);
                const draftData = await draftRes.json();
                
                if (draftData.error) {
                    alert("Draft not found or expired.");
                    setIsLoadingDraft(false);
                    return;
                }

                setExamTitle(draftData.title || "গুচ্ছ মডেল টেস্ট");
                setDuration(draftData.duration || "৫৫ মিনিট");
                setMarks(draftData.marks || "১০০");

                const examRes = await fetch('/api/exams');
                const examDataJson = await examRes.json();
                
                if (examDataJson.success) {
                    const allQs: Question[] = examDataJson.data;
                    
                    // Support both new examConfig format and old questionIds format
                    let draftedQs: WorkspaceQuestion[] = [];
                    
                    if (draftData.examConfig) {
                        draftedQs = draftData.examConfig.map((configItem: any) => {
                            const q = allQs.find(q => q.id === configItem.id);
                            return q ? { ...q, sectionTitle: configItem.sectionTitle } : null;
                        }).filter(Boolean) as WorkspaceQuestion[];
                    } else if (draftData.questionIds) {
                        draftedQs = draftData.questionIds
                            .map((id: string) => allQs.find(q => q.id === id))
                            .filter(Boolean) as WorkspaceQuestion[];
                    }
                        
                    setSelectedQuestions(draftedQs);
                }
            } catch (error) {
                console.error("Error loading draft:", error);
            } finally {
                setIsLoadingDraft(false);
            }
        };

        loadDraft();
    }, [draftId]);

    const handleAddQuestion = (question: Question) => {
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

    const handleRemoveQuestion = (id: string) => {
        setSelectedQuestions(prev => prev.filter(q => q.id !== id));
    };

    const handleReorder = (dragIndex: number, hoverIndex: number) => {
        setSelectedQuestions(prev => {
            const updated = [...prev];
            const [movedItem] = updated.splice(dragIndex, 1);
            updated.splice(hoverIndex, 0, movedItem);
            return updated;
        });
    };

    // Attach a custom section title to a specific question
    const handleSetSection = (id: string, title: string | undefined) => {
        setSelectedQuestions(prev => prev.map(q => q.id === id ? { ...q, sectionTitle: title } : q));
    };

    const alreadyAddedIds = new Set(selectedQuestions.map(q => q.id));

    if (isLoadingDraft) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50 flex-col">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-500 font-medium">Rebuilding your exam from Firebase...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden print:block print:h-auto print:overflow-visible">
            <div className="w-full md:w-100 lg:w-112.5 shrink-0 h-full border-r border-gray-200 shadow-[2px_0_8px_rgba(0,0,0,0.05)] z-10 no-print transition-all">
                <QuestionBank 
                    onAddQuestion={handleAddQuestion} 
                    onAddMultiple={handleAddMultiple}
                    alreadyAddedIds={alreadyAddedIds} 
                />
            </div>

            <div className="flex-1 h-full relative print:block print:h-auto print:overflow-visible">
                <PaperCanvas 
                    selectedQuestions={selectedQuestions} 
                    onRemoveQuestion={handleRemoveQuestion}
                    onReorder={handleReorder}
                    onSetSection={handleSetSection}
                    examTitle={examTitle} setExamTitle={setExamTitle}
                    duration={duration} setDuration={setDuration}
                    marks={marks} setMarks={setMarks}
                />
            </div>
        </div>
    );
}

export default function BuilderPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        }>
            <BuilderContent />
        </Suspense>
    );
}