'use client';

import { Save, FileText, Settings, Trash2, ArrowUp, ArrowDown, SplitSquareVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import QuestionCard from './QuestionCard';
import { WorkspaceQuestion } from '@/app/builder/page'; // Import our extended type

interface PaperCanvasProps {
    selectedQuestions: WorkspaceQuestion[];
    onRemoveQuestion: (id: string) => void;
    onReorder: (dragIndex: number, hoverIndex: number) => void;
    onSetSection: (id: string, title: string | undefined) => void;
    examTitle: string; setExamTitle: (v: string) => void;
    duration: string; setDuration: (v: string) => void;
    marks: string; setMarks: (v: string) => void;
}

export default function PaperCanvas({ 
    selectedQuestions, 
    onRemoveQuestion,
    onReorder,
    onSetSection,
    examTitle, setExamTitle,
    duration, setDuration,
    marks, setMarks
}: PaperCanvasProps) {

    const router = useRouter();

    const handleSaveDraft = async () => {
        if (selectedQuestions.length === 0) {
            alert("Please add at least one question before saving.");
            return;
        }

        try {
            const payload = {
                title: examTitle || "Untitled Exam",
                duration: duration || "৫৫ মিনিট",
                marks: marks || "১০০",
                // Save the configuration mapping IDs to their custom sections
                examConfig: selectedQuestions.map(q => ({
                    id: q.id,
                    sectionTitle: q.sectionTitle || null
                })),
                createdBy: "IT Staff" 
            };

            const res = await fetch('/api/drafts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const data = await res.json();
            if (data.success) {
                router.push('/drafts');
            } else {
                alert("Failed to save draft.");
            }
        } catch (error) {
            console.error("Error saving draft", error);
            alert("Failed to save draft. Check connection.");
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            
            <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm sticky top-0 z-20">
                <div className="flex items-center text-gray-800 font-bold text-lg">
                    <FileText className="mr-2 text-blue-600" size={24} />
                    Exam Workspace
                </div>
                <button 
                    onClick={handleSaveDraft}
                    className="flex items-center px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition-all"
                >
                    <Save size={18} className="mr-2" /> Save to Dashboard
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Exam Configuration Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                        <Settings size={16} className="mr-2" /> Exam Settings
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-1 md:col-span-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Exam Title</label>
                            <input 
                                type="text" 
                                value={examTitle}
                                onChange={(e)=>setExamTitle(e.target.value)}
                                placeholder="e.g. গুচ্ছ মডেল টেস্ট"
                                className="w-full p-3 text-black border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all english font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Total Marks</label>
                            <input 
                                type="text" 
                                value={marks}
                                onChange={(e)=>setMarks(e.target.value)}
                                placeholder="e.g. ১০০"
                                className="w-full p-3 text-black border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all unicode"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Time Allowed</label>
                            <input 
                                type="text" 
                                value={duration}
                                onChange={(e)=>setDuration(e.target.value)}
                                placeholder="e.g. ৫৫ মিনিট"
                                className="w-full p-3 text-black border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all unicode"
                            />
                        </div>
                    </div>
                </div>

                {/* Selected Questions List */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-4">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                            Paper Layout & Questions
                        </h2>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                            Total: {selectedQuestions.length}
                        </span>
                    </div>

                    {selectedQuestions.length === 0 ? (
                        <div className="h-40 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                            <FileText size={40} className="mb-3 text-gray-300" />
                            <p>No questions added yet.</p>
                            <p className="text-sm mt-1">Select questions from the bank on the left.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {selectedQuestions.map((q, index) => (
                                <div key={q.id} className="flex flex-col">
                                    
                                    {/* Section Break Controls */}
                                    <div className="mb-2 mt-4 ml-14">
                                        {q.sectionTitle !== undefined ? (
                                            <div className="flex items-center gap-3">
                                                <SplitSquareVertical size={16} className="text-blue-500" />
                                                <input 
                                                    autoFocus
                                                    type="text" 
                                                    value={q.sectionTitle}
                                                    onChange={(e) => onSetSection(q.id, e.target.value)}
                                                    placeholder="Enter section name (e.g. পদার্থ বিজ্ঞান)"
                                                    className="p-2 border text-black border-blue-300 bg-blue-50 rounded-md outline-none focus:ring-2 focus:ring-blue-500 font-bold bangla w-64"
                                                />
                                                <button 
                                                    onClick={() => onSetSection(q.id, undefined)} 
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Remove Break
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => onSetSection(q.id, "নতুন বিভাগ")}
                                                className="text-xs font-bold text-black hover:text-blue-600 border border-dashed border-gray-300 rounded px-3 py-1.5 transition-colors flex items-center"
                                            >
                                                <SplitSquareVertical size={14} className="mr-1" /> Add Section Break Here
                                            </button>
                                        )}
                                    </div>

                                    {/* Question Block */}
                                    <div className={`flex bg-gray-50 border rounded-lg overflow-hidden transition-colors ${q.sectionTitle !== undefined ? 'border-blue-200 shadow-sm' : 'border-gray-200 hover:border-blue-300'}`}>
                                        
                                        {/* Left Status Bar / Reorder Controls */}
                                        <div className="w-12 bg-gray-100 border-r border-gray-200 flex flex-col items-center justify-center py-2 space-y-2">
                                            <span className="font-bold text-gray-500 text-sm mb-2">{index + 1}</span>
                                            <button 
                                                onClick={() => index > 0 && onReorder(index, index - 1)}
                                                disabled={index === 0}
                                                className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-colors"
                                            >
                                                <ArrowUp size={16} />
                                            </button>
                                            <button 
                                                onClick={() => index < selectedQuestions.length - 1 && onReorder(index, index + 1)}
                                                disabled={index === selectedQuestions.length - 1}
                                                className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-colors"
                                            >
                                                <ArrowDown size={16} />
                                            </button>
                                        </div>

                                        <div className="flex-1 p-4 relative bg-white">
                                            <button 
                                                onClick={() => onRemoveQuestion(q.id)}
                                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors bg-white p-1.5 rounded shadow-sm border border-gray-200"
                                                title="Remove Question"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <QuestionCard question={q} mode="canvas" />
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}