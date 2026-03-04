import { motion } from "framer-motion";
import type { Suggestion } from "../types";

interface SuggestionsListProps {
    suggestions: Suggestion[];
    onSelect: (word: string) => void;
}

export const SuggestionsList = ({ suggestions, onSelect }: SuggestionsListProps) => {
    // Find max info for scaling bars
    const maxInfo = Math.max(...suggestions.map(s => s.info), 0.1);

    if (suggestions.length === 0) {
        return (
            <div className="text-center text-slate-400 py-8">
                No suggestions available.
            </div>
        );
    }

    return (
        <div className="overflow-y-auto overflow-x-hidden p-6 flex flex-col gap-4 h-full">
            {suggestions.map((s, index) => {
                const percentage = (s.info / maxInfo) * 100;

                return (
                    <div
                        key={s.word}
                        className="flex flex-col gap-2 group cursor-pointer"
                        onClick={() => onSelect(s.word)}
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-slate-500 w-4">{index + 1}</span>
                            <span className="text-lg font-bold tracking-widest uppercase text-white w-16">{s.word}</span>
                            <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-wordle-yellow rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ delay: 0.1 + index * 0.05, duration: 0.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                        {/* Hover indicator button like the spec image "Apply 'stunk'" */}
                        <div className="h-0 overflow-hidden opacity-0 lg:group-hover:h-12 lg:group-hover:opacity-100 lg:group-hover:mt-2 transition-all duration-300">
                            <button className="w-full h-full bg-wordle-green text-white font-bold rounded-lg border-none hover:-translate-y-1 transition-transform">
                                Apply "{s.word}"
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
