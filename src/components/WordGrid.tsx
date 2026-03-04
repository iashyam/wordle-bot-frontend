import type { Board } from "../types";
import { Tile } from "./Tile";

interface WordGridProps {
    board: Board;
    activeRowIndex: number;
    onTileClick: (rowIndex: number, colIndex: number) => void;
}

export const WordGrid = ({ board, activeRowIndex, onTileClick }: WordGridProps) => {
    return (
        <div className="flex flex-col gap-2 mt-4 items-center">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2">
                    {row.map((tile, colIndex) => (
                        <Tile
                            key={colIndex}
                            tile={tile}
                            isActiveRow={rowIndex === activeRowIndex}
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
            <div className="text-xs text-wordle-yellow mt-2 -rotate-2">
                <span className="italic">↖ Tap tiles to set color</span>
            </div>
        </div>
    );
};
