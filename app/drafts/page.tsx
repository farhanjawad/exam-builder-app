'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Loader2, Printer, Calendar } from 'lucide-react';

export default function DraftsDashboard() {
    const [drafts, setDrafts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchDrafts = async () => {
            try {
                const res = await fetch('/api/drafts');
                const json = await res.json();
                if (json.success) {
                    setDrafts(json.data);
                }
            } catch (error) {
                console.error("Failed to load drafts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDrafts();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <FileText className="mr-3 text-blue-600" size={32} />
                    Saved Exam Papers
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Exam Title</th>
                                <th className="p-4 font-semibold">Questions</th>
                                <th className="p-4 font-semibold">Date Saved</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drafts.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No drafts saved yet.</td></tr>
                            ) : (
                                drafts.map((draft) => (
                                    <tr key={draft.draftId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800 unicode text-lg">{draft.title}</td>
                                        <td className="p-4 text-gray-600">{draft.questionIds?.length || 0} Qs</td>
                                        <td className="p-4 text-gray-500 flex items-center text-sm">
                                            <Calendar size={14} className="mr-2" />
                                            {new Date(draft.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            {/* This button routes to our brand new isolated Print View */}
                                            <button 
                                                onClick={() => router.push(`/print/${draft.draftId}`)}
                                                className="inline-flex items-center px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-black transition-colors"
                                            >
                                                <Printer size={14} className="mr-2" /> View & Print
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}