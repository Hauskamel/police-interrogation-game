import { SHIFT_NARRATIVE_QUESTIONS } from "../data";

export function getShiftInterviewQuestions({ encounter, clueIds = [] }) {
    const availableClues = new Set(clueIds);

    return Object.keys(encounter?.responses ?? {})
        .map((questionId) => SHIFT_NARRATIVE_QUESTIONS[questionId])
        .filter(Boolean)
        .filter((question) => question.requiredClueIds.every(
            (clueId) => availableClues.has(clueId)
        ));
}
