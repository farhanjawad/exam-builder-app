'use client';

import { useRouter } from 'next/navigation';
import { PenTool, Library, Server, Database, ArrowRight } from 'lucide-react';

export default function Home() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center shadow-inner">
                        <Database className="text-white" size={20} />
                    </div>
                   
                </div>
                <div className="flex items-center text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                    <Server size={14} className="mr-2 text-green-600" /> System Online
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 -mt-10">
                
                <div className="text-center max-w-2xl mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Exam  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Builder Pro</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Access the centralized database to generate, format, and print customized evaluation papers in seconds.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                    
                    {/* Launch Builder Card */}
                    <button 
                        onClick={() => router.push('/builder')}
                        className="group text-left bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                        <div className="relative">
                            <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                                <PenTool size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Create New Exam</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Launch the interactive workspace. Search the database, assemble questions, define custom sections, and prepare a new paper from scratch.
                            </p>
                            <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                                Launch Workspace <ArrowRight size={18} className="ml-2" />
                            </div>
                        </div>
                    </button>

                    {/* Drafts Library Card */}
                    <button 
                        onClick={() => router.push('/drafts')}
                        className="group text-left bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                        <div className="relative">
                            <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                                <Library size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Drafts & Archives</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Access the secure library of previously saved exam papers. Reload past templates, or generate high-quality PDFs for immediate printing.
                            </p>
                            <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                                Open Library <ArrowRight size={18} className="ml-2" />
                            </div>
                        </div>
                    </button>

                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-8 text-sm font-medium text-gray-400">
                Maintained securely by the internal IT infrastructure team.
            </footer>
        </div>
    );
}