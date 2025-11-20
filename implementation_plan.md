# Persist Resumes to Firestore

## Goal
Replace the current `localStorage` "MVP hack" in `ChatInterface.tsx` with real Firestore persistence. This ensures resumes are permanently saved and accessible via unique IDs.

## Proposed Changes

### Components

#### [MODIFY] [ChatInterface.tsx](file:///Users/anilalapati/Documents/Apps/Antigravity/SwitchCV_A/src/components/features/ChatInterface.tsx)
- Import `db` from `@/lib/firebase`.
- Import `collection`, `addDoc`, `serverTimestamp` from `firebase/firestore`.
- In `sendMessage`, when `data.resumeData` is present:
    - Create a new document in `resumes` collection with the resume data and a timestamp.
    - Get the generated ID.
    - Redirect to `/resumes/[generatedId]`.
- Remove `localStorage` logic.

#### [MODIFY] [ResumeFetcher.tsx](file:///Users/anilalapati/Documents/Apps/Antigravity/SwitchCV_A/src/app/resumes/[id]/ResumeFetcher.tsx)
- Remove the "MVP Hack" block that checks for `draft-` prefix and `localStorage`.
- Ensure it handles the loading state correctly while fetching from Firestore.

## Verification Plan

### Manual Verification
1.  Navigate to `/dashboard/create`.
2.  Interact with the chat agent to generate a resume.
3.  Verify that upon completion, the app redirects to `/resumes/[id]` where `[id]` is a Firestore document ID (not starting with `draft-`).
4.  Verify the resume content is displayed correctly.
5.  Refresh the page to ensure data persists.
