import type { TileState, TileColor } from "../types";
import { motion } from "framer-motion";

interface TileProps {
    tile: TileState;
    isActiveRow: boolean;
    onClick: () => void;
}

export const Tile = ({ tile, isActiveRow, onClick }: TileProps) => {
    const getColors = (color: TileColor) => {
        switch (color) {
            case "green":
                return "bg-wordle-green border-wordle-green text-white";
            case "yellow":
                return "bg-wordle-yellow border-wordle-yellow text-white";
            case "gray":
                // Distinguish between empty gray (just border) and filled gray (solid background)
                // Wordle usually shows a border until the guess is submitted, but our spec says user sets colors.
                // We'll treat 'gray' as the entered-but-not-in-word state. If it's empty, it's just a dark tile with border.
                if (!tile.letter) {
                    return "bg-transparent border-wordle-gray text-white";
                }
                return "bg-wordle-gray border-wordle-gray text-white";
            default:
                return "bg-transparent border-wordle-gray text-white";
        }
    };

    return (
        <motion.div
            onClick={() => {
                if (isActiveRow && tile.letter) {
                    onClick();
                }
            }}
            className={`
        w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-3xl font-bold uppercase rounded
        border-2 select-none transition-colors duration-200
        ${isActiveRow && tile.letter ? "cursor-pointer hover:opacity-80" : ""}
        ${getColors(tile.color)}
      `}
            layout
        >
            {tile.letter}
        </motion.div>
    );
};
