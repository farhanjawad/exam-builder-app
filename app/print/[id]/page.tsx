'use client';

import { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, ArrowLeft, Loader2, Columns, Type, LayoutGrid } from 'lucide-react';
import { Question } from '../../../src/lib/dataFetcher';

type PrintQuestion = Question & { sectionTitle?: string; displayNum?: number };

export default function PrintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); 
    const router = useRouter();
    const contentRef = useRef<HTMLDivElement>(null);
    
    const [questions, setQuestions] = useState<PrintQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [title, setTitle] = useState("গুচ্ছ মডেল টেস্ট");
    const [duration, setDuration] = useState("৫৫ মিনিট");
    const [marks, setMarks] = useState("১০০");

    const [columnCount, setColumnCount] = useState<1 | 2>(2);
    const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');
const [optionLayout, setOptionLayout] = useState<'auto' | 'grid-cols-2' | 'grid-cols-1'>('auto');
    useEffect(() => {
        const fetchPrintData = async () => {
            try {
                // 1. Fetch Draft Data
                const draftRes = await fetch(`/api/drafts?id=${id}`);
                if (!draftRes.ok) throw new Error("Failed to connect to Firebase drafts.");
                
                const draftJson = await draftRes.json();
                if (draftJson.error) {
                    alert("Draft not found.");
                    router.push('/drafts');
                    return;
                }
                
                setTitle(draftJson.title || "গুচ্ছ মডেল টেস্ট");
                setDuration(draftJson.duration || "৫৫ মিনিট");
                setMarks(draftJson.marks || "১০০");

                // 2. Fetch the Master Question Bank
                const examRes = await fetch('/api/exams');
                if (!examRes.ok) throw new Error("Failed to load question bank from local API.");
                
                const examJson = await examRes.json();
                if (examJson.success) {
                    const allQs: Question[] = examJson.data;
                    let draftedQs: PrintQuestion[] = [];
                    
                    // Safely reconstruct the array supporting both new and old draft formats
                    if (draftJson.examConfig && Array.isArray(draftJson.examConfig)) {
                        draftedQs = draftJson.examConfig.map((item: any) => {
                            const q = allQs.find(q => q.id === item.id);
                            return q ? { ...q, sectionTitle: item.sectionTitle } : null;
                        }).filter(Boolean) as PrintQuestion[];
                    } else if (draftJson.questionIds && Array.isArray(draftJson.questionIds)) {
                        draftedQs = draftJson.questionIds.map((qId: string) => {
                            const q = allQs.find(q => q.id === qId);
                            return q ? { ...q } : null;
                        }).filter(Boolean) as PrintQuestion[];
                    }

                    // 3. Pre-calculate the numbering logic to prevent React rendering bugs
                    let currentNum = 0;
                    const processedQs = draftedQs.map(q => {
                        if (q.sectionTitle) {
                            currentNum = 1;
                        } else {
                            currentNum++;
                        }
                        return { ...q, displayNum: currentNum };
                    });
                        
                    setQuestions(processedQs);
                } else {
                    throw new Error("Question bank API returned success: false");
                }
            } catch (error: any) {
                console.error("Critical Error loading print data:", error);
                setFetchError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPrintData();
    }, [id, router]);

    // MathJax Trigger
    useEffect(() => {
        if (!loading && questions.length > 0 && typeof window !== 'undefined') {
            // @ts-ignore
            if (window.MathJax && window.MathJax.typesetPromise) {
                // @ts-ignore
                window.MathJax.typesetPromise([contentRef.current]).catch((err: any) => 
                    console.error("MathJax rendering error: ", err)
                );
            }
        }
    }, [loading, questions, columnCount, fontSize]);

    const getFontSizeClass = () => {
        if (fontSize === 'small') return 'text-[0.95rem]';
        if (fontSize === 'large') return 'text-[1.15rem]';
        return 'text-[1.05rem]'; 
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-gray-900 mb-4" size={40} />
                <p className="text-gray-500 font-medium">Assembling document...</p>
            </div>
        );
    }

    if (fetchError || questions.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200 max-w-md">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Failed to load questions</h2>
                    <p className="text-gray-600 text-sm mb-4">
                        {fetchError || "The draft loaded, but no matching questions were found in the database."}
                    </p>
                    <button onClick={() => router.back()} className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-black transition-colors">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-200 print:bg-white font-sans text-black selection:bg-gray-200">
            
            <div className="sticky top-0 z-50 bg-white border-b border-gray-300 shadow-sm p-4 flex justify-between items-center print:hidden flex-wrap gap-4">
                <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium">
                    <ArrowLeft size={18} className="mr-2" /> Back
                </button>

                <div className="flex items-center space-x-6 bg-gray-50 px-6 py-2 rounded-lg border border-gray-200 print:hidden">
                    <div className="flex items-center space-x-2">
                        <Columns size={16} className="text-gray-500" />
                        <span className="text-sm font-semibold mr-2">Columns:</span>
                        <select value={columnCount} onChange={(e) => setColumnCount(Number(e.target.value) as 1 | 2)} className="bg-white border border-gray-300 rounded text-sm p-1 outline-none">
                            <option value={1}>1 Column</option>
                            <option value={2}>2 Columns</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Type size={16} className="text-gray-500" />
                        <span className="text-sm font-semibold mr-2">Size:</span>
                        <select value={fontSize} onChange={(e) => setFontSize(e.target.value as any)} className="bg-white border border-gray-300 rounded text-sm p-1 outline-none">
                            <option value="small">Small</option>
                            <option value="normal">Normal</option>
                            <option value="large">Large</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <LayoutGrid size={16} className="text-gray-500" />
                        <span className="text-sm font-semibold mr-2">Options:</span>
                        <select value={optionLayout} onChange={(e) => setOptionLayout(e.target.value as any)} className="bg-white border border-gray-300 rounded text-sm p-1 outline-none">
                            <option value="auto">Smart Auto-Fit</option>
                            <option value="grid-cols-2">2x2 Grid</option>
                            <option value="grid-cols-1">Vertical List</option>
                        </select>
                    </div>
                </div>

                <button onClick={() => window.print()} className="flex items-center px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-black shadow-md transition-all font-semibold">
                    <Printer size={18} className="mr-2" /> Print PDF
                </button>
            </div>

            <div ref={contentRef} className="py-8 print:py-0 print:m-0">
                
                {/* PAGE 1: EXAM PAPER */}
                <div className="bg-white max-w-[210mm] mx-auto shadow-xl px-10 py-12 print:shadow-none print:w-full print:max-w-none print:px-0 print:py-0 print:m-0">
                    
                    <div className="mb-6 pb-4 border-b-2 border-gray-800">
                        <div className="text-center space-y-1">
                            <div className="text-xl font-bold english">ইউনিভার্সিটি অ্যাডমিশন প্রোগ্রাম ২০২৫</div>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e)=>setTitle(e.target.value)}
                                className="text-lg font-bold text-center w-full focus:outline-none print:bg-transparent bg-transparent english  rounded print:p-0"
                            />
                        </div>
                        <div className="flex justify-between text-sm font-bold mb-3 unicode">
                            <div className="flex items-center">
                                মোট নম্বর: <input type="text" value={marks} onChange={(e)=>setMarks(e.target.value)} className="w-16 ml-1 focus:outline-none print:bg-transparent bg-transparent px-1 rounded print:p-0 font-bold english text-md" />
                            </div>
                            <div className="flex items-center">
                                সময়:<input type="text" value={duration} onChange={(e)=>setDuration(e.target.value)} className="w-24 ml-1  focus:outline-none print:bg-transparent bg-transparent px-1 rounded font-bold english text-md" />
                            </div>
                        </div>
                    </div>

                    <div className={`${columnCount === 2 ? 'print:columns-2 columns-1 md:columns-2 print:gap-10 gap-8' : 'columns-1'} ${getFontSizeClass()}`}>
                        {questions.map((q) => (
                            <div key={q.id} className="print:break-inside-avoid print:mb-6 mb-6">
                                
                                {q.sectionTitle && (
                                    <div className="text-center mb-5 mt-4 print:break-after-avoid col-span-full">
                                        <span className="text-[1.2em] font-bold english underline underline-offset-4 tracking-wide">
                                            {q.sectionTitle}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-start">
                                    <span className="font-bold mr-2">{q.displayNum}.</span>
                                    <div className="flex-1 leading-snug" dangerouslySetInnerHTML={{ __html: q.question_html }} />
                                </div>
                                
                                {q.options_html && q.options_html.length > 0 && (() => {
                                    const rawText = q.options_html.map(opt => opt.replace(/<[^>]+>/g, ''));
                                    // 2. Determine if any single option is long, or if the total length is heavy
                                    const isLong = rawText.some(opt => opt.length > 25) || rawText.join('').length > 90;
                                    // 3. Decide the final class
                                    const layoutClass = optionLayout === 'auto' 
                                        ? (isLong ? 'grid-cols-1' : 'grid-cols-2') 
                                        : optionLayout;

                                    return (
                                        <div className={`grid ${layoutClass} gap-x-4 gap-y-2 mt-3 ml-6 text-[0.95em]`}>
                                            {q.options_html.map((opt, idx) => (
                                                <div key={idx} className="flex items-start">
                                                    <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                                                    <div dangerouslySetInnerHTML={{ __html: opt }} />
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        ))}
                    </div>
                </div>

                {/* PAGE 2: ANSWER SHEET */}
                <div className="bg-white max-w-[210mm] mx-auto shadow-xl px-10 py-12 mt-12 print:shadow-none print:w-full print:max-w-none print:px-0 print:py-0 print:m-0 break-before-page print:break-before-page">
                    
                    <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
                        <h2 className="text-2xl font-bold uppercase tracking-wide">Answer Sheet</h2>
                        <p className="text-gray-700 font-bold mt-1 english">{title}</p>
                    </div>

                    <div className={`space-y-6 ${getFontSizeClass()}`}>
                        {questions.map((q) => {
                            const correctIndex = q.options_html.findIndex(opt => opt === q.correct_answer_html);
                            const correctLetter = correctIndex >= 0 ? String.fromCharCode(65 + correctIndex) : "✔️";

                            return (
                                <div key={`sol-${q.id}`} className="print:break-inside-avoid">
                                    
                                    {q.sectionTitle && (
                                        <h3 className="text-lg font-bold english bg-gray-100 print:bg-transparent print:border-b-2 print:border-gray-800 p-2 text-center rounded mb-4 mt-8">
                                            {q.sectionTitle}
                                        </h3>
                                    )}

                                    <div className="font-bold text-lg mb-2 flex items-center border-b border-gray-200 pb-1">
                                        <span className="mr-3">{q.displayNum}.</span>
                                        Answer: {correctLetter}
                                    </div>
                                    
                                    <div className="ml-8">
                                        <div className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Correct Option:</div>
                                        <div dangerouslySetInnerHTML={{ __html: q.correct_answer_html }} className="mb-4 text-[0.95em]" />
                                        
                                        {q.solution_html && (
                                            <>
                                                <div className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Detailed Solution:</div>
                                                <div dangerouslySetInnerHTML={{ __html: q.solution_html }} className="border-l-2 border-gray-400 pl-4 py-1 text-[0.95em] text-gray-800" />
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}