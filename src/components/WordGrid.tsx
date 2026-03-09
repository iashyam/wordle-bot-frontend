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

    // We intentionally removed auto-focus on mount or row advance on mobile to prevent 
    // the keyboard popping up aggressively.
    useEffect(() => {
        // If the user strikes the winning pattern, aggressively remove focus
        // so the keyboard dismisses immediately and they can see the whole board.
        if (isWin) {
            inputRef.current?.blur();
        }
    }, [activeRowIndex, isWin]);

    const handleGridTap = (e: React.MouseEvent) => {
        // We only want the native keyboard to summon on mobile when we tap the active row specifically,
        // and ONLY if we aren't tapping an existing letter tile to change its color.

        // Let's check if the click target is a tile that already has a letter in it.
        // We will add a data-attribute to our Tile component, or just check text content.
        const target = e.target as HTMLElement;
        const isLetterTile = target.closest('[data-has-letter="true"]');

        if (!isWin && window.innerWidth < 1024 && !isLetterTile) {
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
                        // Explicitly dismiss the keyboard when Enter is pressed
                        e.currentTarget.blur();
                    }
                }}
                className="opacity-0 absolute -z-10"
                style={{ top: 0, left: -9999, width: '1px', height: '1px', fontSize: '16px' }}
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
