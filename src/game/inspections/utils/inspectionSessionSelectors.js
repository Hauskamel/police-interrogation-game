// ##### Inspection Session Selectors
// -----> Leiten UI-Hilfswerte aus dem kanonischen Sessionzustand ab.
// ---> Dadurch müssen Dokumentanfragen und Interviewfragen nicht doppelt gespeichert werden.
export function getRequestedDocumentTypes(inspectionSession) {
    return Object.keys(inspectionSession?.documentRequestStates ?? {});
}

export function getAskedQuestionIds(inspectionSession) {
    return Array.from(new Set(
        (inspectionSession?.conversationEntries ?? [])
            .filter((entry) => entry.type === "interview" && entry.questionId)
            .map((entry) => entry.questionId)
    ));
}
