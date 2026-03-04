import { CornerDownLeft, Delete } from "lucide-react";

interface KeyboardProps {
    onKeyPress: (key: string) => void;
    onBackspace: () => void;
    onEnter: () => void;
}

export const Keyboard = ({ onKeyPress, onBackspace, onEnter }: KeyboardProps) => {
    const rows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
    ];

    return (
        <div className="flex flex-col items-center gap-2 w-full max-w-lg mt-auto mb-4">
            {rows.map((row, i) => (
                <div key={i} className="flex justify-center gap-1 sm:gap-2 w-full px-1">
                    {row.map((key) => {
                        const isEnter = key === "ENTER";
                        const isBackspace = key === "BACKSPACE";
                        const isSpecial = isEnter || isBackspace;

                        return (
                            <button
                                key={key}
                                onClick={() => {
                                    if (isEnter) onEnter();
                                    else if (isBackspace) onBackspace();
                                    else onKeyPress(key);
                                }}
                                className={`flex items-center justify-center font-bold rounded bg-wordle-key text-white 
                  transition-colors hover:bg-slate-500 active:bg-slate-400 select-none
                  h-14 sm:h-14 ${isSpecial ? "px-2 sm:px-4 text-xs sm:text-sm" : "flex-1 text-lg sm:text-xl max-w-[40px] sm:max-w-[48px]"}`}
                            >
                                {isEnter ? <CornerDownLeft size={20} /> : isBackspace ? <Delete size={20} /> : key}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
