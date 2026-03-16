'use client';

import { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import { Question } from '../../../src/lib/dataFetcher';

export default function PrintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const contentRef = useRef<HTMLDivElement>(null);

    const [examData, setExamData] = useState<any>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch the Draft and the corresponding Questions
   useEffect(() => {
        const fetchPrintData = async () => {
            try {
                // 4. Use the unwrapped 'id' variable here instead of params.id
                const draftRes = await fetch(`/api/drafts?id=${id}`);
                const draftJson = await draftRes.json();
                
                if (draftJson.error) {
                    alert("Draft not found.");
                    router.push('/drafts');
                    return;
                }
                
                setExamData(draftJson);

                // Fetch the question bank to get the actual HTML content
                const examRes = await fetch('/api/exams');
                const examJson = await examRes.json();
                
                if (examJson.success) {
                    const allQs: Question[] = examJson.data;
                    const draftedQs = (draftJson.questionIds || [])
                        .map((qId: string) => allQs.find(q => q.id === qId))
                        .filter(Boolean) as Question[];
                        
                    setQuestions(draftedQs);
                }
            } catch (error) {
                console.error("Error loading print data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrintData();
    }, [id, router]);

    // 2. Trigger MathJax to render the raw LaTeX once the questions are loaded into the DOM
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
    }, [loading, questions]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-gray-900 mb-4" size={40} />
                <p className="text-gray-500 font-medium">Preparing document for print...</p>
            </div>
        );
    }

    if (!examData || questions.length === 0) {
        return <div className="min-h-screen flex items-center justify-center">No data available to print.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-200 print:bg-white font-sans text-black selection:bg-gray-200">

            {/* Floating Action Bar (Stays at the top of the screen but vanishes on print) */}
            <div className="sticky float-right top-0 z-50 bg-white border-b border-gray-300 shadow-sm p-4 flex justify-between items-center no-print">
                <button
                    onClick={() => window.print()}
                    className="flex items-center px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-black shadow-md transition-all font-semibold"
                >
                    <Printer size={18} className="mr-2" /> Print Document
                </button>
            </div>

            {/* The Pure Document Wrapper */}
            <div ref={contentRef} className="py-8 print:py-0 print:m-0">


                <div className="bg-white max-w-[210mm] mx-auto shadow-xl px-12 py-16 print:shadow-none print:w-full print:max-w-none print:px-0 print:py-0 print:m-0">

                    {/* Header Block */}
                    <div className="mb-6 pb-4 border-b-2 border-gray-800">
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <div>মোট নম্বর: {examData.marks || "১০০"}</div>
                            <div>সময়: {examData.duration || "৫৫ মিনিট"}</div>
                        </div>
                        <div className="text-center space-y-1">
                            <div className="text-xl font-bold unicode">ইউনিভার্সিটি অ্যাডমিশন প্রোগ্রাম ২০২৫</div>
                            <div className="text-lg font-bold unicode">{examData.title || "গুচ্ছ মডেল টেস্ট"}</div>
                            <div className="text-md font-bold underline underline-offset-4 unicode">পদার্থ বিজ্ঞান</div>
                        </div>
                    </div>

                    {/* 2-Column Questions Layout */}
                    <div className="print:columns-2 columns-1 print:gap-10 space-y-6 print:space-y-0 text-[1.05rem]">
                        {questions.map((q, index) => (
                            <div key={q.id} className="print:break-inside-avoid print:mb-6">
                                <div className="flex items-start">
                                    <span className="font-bold mr-2">{index + 1}.</span>
                                    <div className="flex-1 leading-snug" dangerouslySetInnerHTML={{ __html: q.question_html }} />
                                </div>

                                {q.options_html && q.options_html.length > 0 && (
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 ml-6 text-[1rem]">
                                        {q.options_html.map((opt, idx) => (
                                            <div key={idx} className="flex items-start">
                                                <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                                                <div dangerouslySetInnerHTML={{ __html: opt }} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white max-w-[210mm] mx-auto shadow-xl px-12 py-16 mt-12 print:shadow-none print:w-full print:max-w-none print:px-0 print:py-0 print:m-0 break-before-page print:break-before-page">

                    <div className="text-center mb-10 border-b-2 border-gray-800 pb-4">
                        <h2 className="text-2xl font-bold uppercase tracking-wide">Answer Sheet & Solutions</h2>
                        <p className="text-gray-700 font-bold mt-1 unicode">{examData.title || "গুচ্ছ মডেল টেস্ট"}</p>
                    </div>

                    <div className="space-y-8">
                        {questions.map((q, index) => {
                            const correctIndex = q.options_html.findIndex(opt => opt === q.correct_answer_html);
                            const correctLetter = correctIndex >= 0 ? String.fromCharCode(65 + correctIndex) : "✔️";

                            return (
                                <div key={`sol-${q.id}`} className="print:break-inside-avoid">
                                    <div className="font-bold text-lg mb-2 flex items-center border-b border-gray-200 pb-2">
                                        <span className="bg-gray-100 px-3 py-1 border border-gray-300 rounded mr-3 print:border-none print:px-0 print:bg-transparent">
                                            {index + 1}.
                                        </span>
                                        Answer: {correctLetter}
                                    </div>

                                    <div className="ml-12">
                                        <div className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Correct Option:</div>
                                        <div dangerouslySetInnerHTML={{ __html: q.correct_answer_html }} className="mb-4 text-[1.05rem]" />

                                        {q.solution_html && (
                                            <>
                                                <div className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Detailed Solution:</div>
                                                <div dangerouslySetInnerHTML={{ __html: q.solution_html }} className="border-l-2 border-gray-400 pl-4 py-1 text-[1.05rem] text-gray-800" />
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