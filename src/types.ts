export type TileColor = "gray" | "yellow" | "green";

export type TileState = {
    letter: string;
    color: TileColor;
};

export type GuessRow = TileState[];

export type Board = GuessRow[];

export type Suggestion = {
    word: string;
    info: number;
};

export type StartSessionResponse = {
    session_id: string;
    message: string;
    remaining_count: number;
    best_guesses: Suggestion[];
};

export type PredictNextWordResponse = {
    session_id: string;
    remaining_count: number;
    best_guesses: Suggestion[];
    history: string[];
};
