'use client';

import { useState } from 'react';
import { Printer, Save, FileText, Settings2 } from 'lucide-react';
import { Question } from '../lib/dataFetcher';
import QuestionCard from './QuestionCard';

interface PaperCanvasProps {
    selectedQuestions: Question[];
    onRemoveQuestion: (id: string) => void;
    onReorder: (dragIndex: number, hoverIndex: number) => void; // Placeholder for drag-and-drop later
}

export default function PaperCanvas({ selectedQuestions, onRemoveQuestion }: PaperCanvasProps) {
    // Exam Header State
    const [examTitle, setExamTitle] = useState("Weekly Evaluation Test");
    const [duration, setDuration] = useState("45 Minutes");
    const [marks, setMarks] = useState("50");
    const [saving, setSaving] = useState(false);

    const handleSaveDraft = async () => {
        if (selectedQuestions.length === 0) {
            alert("Add some questions before saving!");
            return;
        }
        
        setSaving(true);
        try {
            const payload = {
                title: examTitle,
                duration,
                marks,
                questionIds: selectedQuestions.map(q => q.id),
                createdBy: "IT Staff" 
            };

            const res = await fetch('/api/drafts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const data = await res.json();
            if (data.success) {
                alert(`Draft saved successfully! ID: ${data.draftId}`);
            }
        } catch (error) {
            console.error("Error saving draft", error);
            alert("Failed to save draft. Check connection.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
            {/* Top Action Bar (Hidden during print) */}
            <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm no-print sticky top-0 z-20">
                <div className="flex items-center text-gray-700 font-semibold">
                    <FileText className="mr-2 text-blue-600" size={20} />
                    Current Exam ({selectedQuestions.length} Questions)
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleSaveDraft}
                        disabled={saving}
                        className="flex items-center px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition-colors"
                    >
                        <Save size={16} className="mr-2" />
                        {saving ? "Saving..." : "Save Draft"}
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm transition-colors"
                    >
                        <Printer size={16} className="mr-2" />
                        Print / PDF
                    </button>
                </div>
            </div>

            {/* The Physical Paper Canvas */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="bg-white max-w-[210mm] mx-auto min-h-[297mm] shadow-lg print:shadow-none print:w-full print:max-w-none">
                    
                    {/* Editable Exam Header */}
                    <div className="border-b-2 border-gray-800 p-8 pb-6 mb-6 text-center">
                        <input 
                            type="text" 
                            value={examTitle}
                            onChange={(e) => setExamTitle(e.target.value)}
                            className="text-2xl font-bold text-center w-full focus:outline-none focus:bg-gray-50 mb-4 print:bg-transparent"
                            placeholder="Enter Exam Title..."
                        />
                        <div className="flex justify-between text-gray-700 font-bold border-t border-b border-gray-200 py-2 mt-4 px-4">
                            <div className="flex items-center">
                                <span className="mr-2 no-print"><Settings2 size={16}/></span>
                                Time: <input type="text" value={duration} onChange={(e)=>setDuration(e.target.value)} className="w-24 ml-1 focus:outline-none print:bg-transparent bg-transparent" />
                            </div>
                            <div className="flex items-center">
                                Marks: <input type="text" value={marks} onChange={(e)=>setMarks(e.target.value)} className="w-16 ml-1 text-right focus:outline-none print:bg-transparent bg-transparent" />
                            </div>
                        </div>
                    </div>

                    {/* Questions Area */}
                    <div className="px-8 pb-8">
                        {selectedQuestions.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-400 no-print border-2 border-dashed border-gray-200 rounded-lg">
                                <FileText size={48} className="mb-4 text-gray-300" />
                                <p>No questions added yet.</p>
                                <p className="text-sm mt-2">Click the + icon in the Question Bank.</p>
                            </div>
                        ) : (
                            selectedQuestions.map((q, index) => (
                                <div key={q.id} className="relative group">
                                    <div className="absolute -left-6 top-6 font-bold text-gray-600 no-print">
                                        {index + 1}.
                                    </div>
                                    <span className="hidden print:inline-block absolute -left-6 top-0 font-bold text-gray-800">
                                        {index + 1}.
                                    </span>
                                    <QuestionCard 
                                        question={q} 
                                        mode="canvas" 
                                        onRemove={onRemoveQuestion} 
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}