import type { Board } from "../types";
import { Tile } from "./Tile";
import { useRef, useEffect } from "react";

interface WordGridProps {
    board: Board;
    activeRowIndex: number;
    isWin?: boolean;
    onTileClick: (rowIndex: number, colIndex: number) => void;
    onNativeInputChange?: (value: string) => void;
    onNativeEnter?: () => void;
}

export const WordGrid = ({ board, activeRowIndex, isWin, onTileClick, onNativeInputChange, onNativeEnter }: WordGridProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Get the current word string for the hidden input
    const currentWord = board[activeRowIndex]?.map(t => t.letter).join("") || "";

    // Keep focus when row changes or component mounts if we're not winning
    useEffect(() => {
        if (!isWin && window.innerWidth < 1024) {
            inputRef.current?.focus();
        }
    }, [activeRowIndex, isWin]);

    const handleGridTap = () => {
        if (!isWin && window.innerWidth < 1024) {
            inputRef.current?.focus();
        }
    };

    return (
        <div
            className="flex flex-col gap-1.5 mt-2 lg:mt-4 items-center relative cursor-text"
            onClick={handleGridTap}
        >
            {/* Hidden input to summon the native mobile keyboard */}
            <input
                ref={inputRef}
                type="text"
                value={currentWord}
                onChange={(e) => onNativeInputChange?.(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onNativeEnter?.();
                    }
                }}
                className="opacity-0 absolute -z-10 w-0 h-0"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck="false"
                maxLength={5}
                disabled={isWin}
            />

            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1.5">
                    {row.map((tile, colIndex) => (
                        <Tile
                            key={colIndex}
                            tile={tile}
                            isActiveRow={rowIndex === activeRowIndex}
                            isWin={isWin && rowIndex === activeRowIndex}
                            colIndex={colIndex}
                            onClick={() => onTileClick(rowIndex, colIndex)}
                        />
                    ))}
                </div>
            ))}
            <div className="flex gap-4 mt-6 items-center text-sm font-medium text-slate-300 bg-wordle-bg border border-slate-700 rounded-full px-6 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-wordle-gray"></div>
                    <span>Gray</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-wordle-yellow"></div>
                    <span>Yellow</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-wordle-green"></div>
                    <span>Green</span>
                </div>
            </div>
            <div className="text-sm text-wordle-yellow mt-3 mb-1 font-bold animate-pulse">
                <span>↖ Tap tiles to set color</span>
            </div>
        </div>
    );
};
