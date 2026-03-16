import { NextResponse } from 'next/server';
import { db } from '../../../src/lib/firebase';
import { collection, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';

// ⚠️ Function name MUST be strictly uppercase POST
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, duration, marks, questionIds, createdBy } = body;

        // Failsafe: Don't save empty exams
        if (!questionIds || questionIds.length === 0) {
            return NextResponse.json({ error: "No questions provided" }, { status: 400 });
        }

        // Generate a random ID (e.g., "draft_a1b2c3")
        const draftId = `draft_${Math.random().toString(36).substring(2, 8)}`;
        const draftRef = doc(collection(db, 'exam_drafts'), draftId);

        // Save to Firebase
        await setDoc(draftRef, {
            draftId,
            title: title || "Untitled Exam",
            duration: duration || "55 Minutes",
            marks: marks || "100",
            questionIds,
            createdBy: createdBy || "IT Staff",
            createdAt: new Date().toISOString()
        });

        return NextResponse.json({ success: true, draftId }, { status: 200 });

    } catch (error) {
        console.error("POST Error saving draft:", error);
        return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
    }
}

// ⚠️ Function name MUST be strictly uppercase GET
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const draftId = searchParams.get('id');

        if (draftId) {
            // SCENARIO 1: Fetching a single specific draft for the Print page
            const draftRef = doc(db, 'exam_drafts', draftId);
            const draftSnap = await getDoc(draftRef);

            if (draftSnap.exists()) {
                return NextResponse.json(draftSnap.data(), { status: 200 });
            } else {
                return NextResponse.json({ error: "Draft not found" }, { status: 404 });
            }
        } else {
            // SCENARIO 2: Fetching ALL drafts for the IT Dashboard
            const draftsRef = collection(db, 'exam_drafts');
            const querySnapshot = await getDocs(draftsRef);
            
            const drafts = querySnapshot.docs.map(doc => doc.data());
            
            // Sort by newest first using standard JS (bypasses Firebase index requirements)
            drafts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            return NextResponse.json({ success: true, data: drafts }, { status: 200 });
        }
    } catch (error) {
        console.error("GET Error fetching draft:", error);
        return NextResponse.json({ error: "Failed to fetch draft" }, { status: 500 });
    }
}