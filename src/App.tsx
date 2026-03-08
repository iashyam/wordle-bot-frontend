import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Header } from "./components/Header";
import { WordGrid } from "./components/WordGrid";
import { Keyboard } from "./components/Keyboard";
import { SuggestionsSheet } from "./components/SuggestionsSheet";
import { SuggestionsList } from "./components/SuggestionsList";
import type { Board, Suggestion, TileColor } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { startSession, predictNextWord, closeSession } from "./api";

const createEmptyBoard = (): Board =>
  Array(6).fill(null).map(() =>
    Array(5).fill(null).map(() => ({ letter: "", color: "gray" }))
  );

function App() {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");
  const [remainingCount, setRemainingCount] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isWin, setIsWin] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initialize session on mount
  useEffect(() => {
    initSession();
    return () => {
      if (sessionId) closeSession(sessionId).catch(console.error);
    };
  }, []);

  const initSession = async () => {
    try {
      if (sessionId) await closeSession(sessionId).catch(() => { });
      const newSessionId = uuidv4();
      setSessionId(newSessionId);

      const res = await startSession(newSessionId);
      setRemainingCount(res.remaining_count);
      setSuggestions(res.best_guesses);
      setBoard(createEmptyBoard());
      setActiveRowIndex(0);
      setIsSheetOpen(true);
      setIsWin(false);
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };

  const currentColIndex = board[activeRowIndex]?.findIndex(t => t.letter === "");
  const activeCol = currentColIndex === -1 ? 5 : currentColIndex;

  const handleKeyPress = (key: string) => {
    if (activeCol < 5 && activeRowIndex < 6 && !isWin) {
      const newBoard = [...board];
      newBoard[activeRowIndex][activeCol] = { letter: key, color: "gray" };
      setBoard(newBoard);
    }
  };

  const handleBackspace = () => {
    if (activeCol > 0 && activeRowIndex < 6) {
      const newBoard = [...board];
      newBoard[activeRowIndex][activeCol - 1] = { letter: "", color: "gray" };
      setBoard(newBoard);
    }
  };

  const handleTileClick = (rowIndex: number, colIndex: number) => {
    if (rowIndex !== activeRowIndex || isWin) return;

    const tile = board[rowIndex][colIndex];
    if (!tile.letter) return; // Don't cycle empty tiles

    const colorCycle: Record<TileColor, TileColor> = {
      gray: "yellow",
      yellow: "green",
      green: "gray"
    };

    const newBoard = [...board];
    newBoard[rowIndex][colIndex] = {
      ...tile,
      color: colorCycle[tile.color]
    };
    setBoard(newBoard);
  };

  const isRowComplete = activeCol === 5;

  const handleApplyPattern = async () => {
    if (!isRowComplete || !sessionId || isWin) return;

    setIsLoading(true);
    try {
      const row = board[activeRowIndex];
      const guess = row.map(t => t.letter).join("").toLowerCase();
      const patternMap: Record<TileColor, string> = { gray: "B", yellow: "Y", green: "G" };
      const pattern = row.map(t => patternMap[t.color]).join("");

      const res = await predictNextWord(sessionId, guess, pattern);
      setRemainingCount(res.remaining_count);
      setSuggestions(res.best_guesses);
      setIsSheetOpen(true);

      if (pattern === "GGGGG") {
        setIsWin(true);
        showToast("Splendid! You found the word!");
      }

      if (activeRowIndex < 5 && pattern !== "GGGGG") {
        setActiveRowIndex(activeRowIndex + 1);
      }
    } catch (err: any) {
      console.error("Prediction failed:", err);
      showToast("Word not in list.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionSelect = (word: string) => {
    if (activeRowIndex < 6 && !isWin) {
      const newBoard = [...board];
      for (let i = 0; i < 5; i++) {
        newBoard[activeRowIndex][i] = { letter: word[i].toUpperCase(), color: "gray" };
      }
      setBoard(newBoard);
      setIsSheetOpen(false);
    }
  };

  const handleNativeInputChange = (value: string) => {
    if (isWin) return;

    // We only want to handle valid A-Z characters
    const sanitizedValue = value.replace(/[^a-zA-Z]/g, "").toUpperCase();
    const limitedValue = sanitizedValue.slice(0, 5);

    const newBoard = [...board];
    for (let i = 0; i < 5; i++) {
      newBoard[activeRowIndex][i] = {
        letter: limitedValue[i] || "",
        color: newBoard[activeRowIndex][i].color
      };
    }
    setBoard(newBoard);
  };

  useEffect(() => {
    const handlePhysicalKeyDown = (e: KeyboardEvent) => {
      // Allow physical keyboard on desktop even if suggestions are shown
      // lg breakpoint is 1024px in Tailwind
      const isDesktop = window.innerWidth >= 1024;
      if (isSheetOpen && !isDesktop) return;

      const key = e.key.toUpperCase();
      if (key === "ENTER") {
        handleApplyPattern();
      } else if (key === "BACKSPACE") {
        handleBackspace();
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener("keydown", handlePhysicalKeyDown);
    return () => window.removeEventListener("keydown", handlePhysicalKeyDown);
  }, [activeCol, activeRowIndex, board, isSheetOpen, isWin, handleApplyPattern, handleBackspace, handleKeyPress]);

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row relative overflow-hidden bg-wordle-bg justify-center">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="absolute top-16 left-1/2 z-50 bg-wordle-gray border border-slate-700 text-white font-bold px-6 py-3 rounded shadow-lg pointer-events-none whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Game Content container (anchoring toasts over the grid) */}
      <div className="flex-1 flex flex-col items-center relative h-full w-full max-w-[500px] mx-auto">
        <Header remainingCount={remainingCount} onReset={initSession} />

        <div className="flex-1 flex flex-col overflow-y-auto px-4 pb-4 items-center">
          <WordGrid
            board={board}
            activeRowIndex={activeRowIndex}
            onTileClick={handleTileClick}
            isWin={isWin}
            onNativeInputChange={handleNativeInputChange}
            onNativeEnter={handleApplyPattern}
          />

          <div className="mt-8 mb-4 w-full flex justify-center">
            <button
              onClick={handleApplyPattern}
              disabled={!isRowComplete || isLoading}
              className={`
              w-full max-w-[280px] py-3 rounded-lg font-bold text-lg text-white shadow-lg transition-all
              ${isRowComplete && !isLoading
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 cursor-pointer"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"}
            `}
            >
              {isLoading ? "Applying..." : "Apply Pattern"}
            </button>
          </div>
        </div>

        {/* Desktop On-Screen Keyboard */}
        <div className="hidden lg:block w-full pb-safe pt-2 bg-wordle-bg border-none lg:mb-6">
          <Keyboard
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onEnter={handleApplyPattern}
          />
        </div>

      </div> {/* End Main Game Area */}

      {/* Desktop Suggestions Side Panel */}
      <div className="hidden lg:flex w-[380px] flex-col bg-wordle-card border-l border-slate-800 shrink-0">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white tracking-widest uppercase">Top Suggestions</h2>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <SuggestionsList suggestions={suggestions} onSelect={handleSuggestionSelect} />
        </div>
      </div>

      <SuggestionsSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        suggestions={suggestions}
        onSelect={handleSuggestionSelect}
      />
    </div>
  );
}

export default App;
