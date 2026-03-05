import type { PredictNextWordResponse, StartSessionResponse } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export const startSession = async (sessionId: string): Promise<StartSessionResponse> => {
    const res = await fetch(`${API_BASE}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
    });
    if (!res.ok) throw new Error("Failed to start session");
    return res.json();
};

export const predictNextWord = async (
    sessionId: string,
    guess: string,
    pattern: string
): Promise<PredictNextWordResponse> => {
    const res = await fetch(`${API_BASE}/predict_next_word`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, guess, pattern }),
    });
    if (!res.ok) throw new Error("Failed to predict next word");
    return res.json();
};

export const closeSession = async (sessionId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
    });
    if (!res.ok) throw new Error("Failed to close session");
};
