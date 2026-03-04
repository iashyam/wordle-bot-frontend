import { motion, AnimatePresence } from "framer-motion";
import type { Suggestion } from "../types";
import { X } from "lucide-react";

interface SuggestionsSheetProps {
    isOpen: boolean;
    onClose: () => void;
    suggestions: Suggestion[];
    onSelect: (word: string) => void;
}

export const SuggestionsSheet = ({ isOpen, onClose, suggestions, onSelect }: SuggestionsSheetProps) => {
    // Find max info for scaling bars
    const maxInfo = Math.max(...suggestions.map(s => s.info), 0.1);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-wordle-card rounded-t-3xl shadow-xl max-h-[80vh] flex flex-col"
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, { offset, velocity }) => {
                            if (offset.y > 100 || velocity.y > 500) {
                                onClose();
                            }
                        }}
                    >
                        <div className="flex justify-center p-3 cursor-grab active:cursor-grabbing">
                            <div className="w-12 h-1.5 bg-slate-600 rounded-full" />
                        </div>

                        <div className="px-6 flex items-center justify-between pb-4 border-b border-slate-700">
                            <h2 className="text-xl font-bold text-white">Top Suggestions</h2>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors bg-transparent border-none">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto overflow-x-hidden p-6 flex flex-col gap-4">
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
                                        <div className="h-0 overflow-hidden opacity-0 group-hover:h-12 group-hover:opacity-100 group-hover:mt-2 transition-all duration-300">
                                            <button className="w-full h-full bg-wordle-green text-white font-bold rounded-lg border-none hover:-translate-y-1 transition-transform">
                                                Apply "{s.word}"
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {suggestions.length === 0 && (
                                <div className="text-center text-slate-400 py-8">
                                    No suggestions available.
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
