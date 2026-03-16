'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Search, PlusCircle, BookOpen } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();
    const [draftId, setDraftId] = useState('');

    const handleLoadDraft = (e: React.FormEvent) => {
        e.preventDefault();
        if (draftId.trim()) {
            // Routes to the builder and passes the draft ID in the URL
            router.push(`/builder?draft=${draftId.trim()}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-white p-6">
            
            <div className="max-w-3xl w-full space-y-8 text-center">
                {/* Header Section */}
                <div className="space-y-4">
                    <div className="mx-auto w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                        <BookOpen className="text-white" size={40} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Exam Builder <span className="text-blue-600">Pro</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-xl mx-auto">
                        The centralized question bank and test generation tool for the institute. Build, format, and print exams in seconds.
                    </p>
                </div>

                {/* Main Action Cards */}
                <div className="grid md:grid-cols-2 gap-6 mt-12 text-left">
                    
                    {/* Create New Exam Card */}
                    <div 
                        onClick={() => router.push('/builder')}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                    >
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <PlusCircle className="text-blue-600" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Create New Exam</h2>
                        <p className="text-gray-500 text-sm">
                            Browse the entire database of thousands of questions, filter by subject, and build a new paper from scratch.
                        </p>
                    </div>

                    {/* Load Draft Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-6">
                            <FileText className="text-green-600" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Resume Draft</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Have a draft ID from a previous session? Enter it below to load your saved questions and continue editing.
                        </p>
                        
                        <form onSubmit={handleLoadDraft} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="e.g. draft_8f72a" 
                                    value={draftId}
                                    onChange={(e) => setDraftId(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                />
                            </div>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Load
                            </button>
                        </form>
                    </div>

                </div>

                {/* Footer Tag */}
                <div className="pt-12 text-sm text-gray-400 font-medium">
                    Maintained by the IT Infrastructure Team
                </div>
            </div>
        </div>
    );
}