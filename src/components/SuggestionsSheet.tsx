import { motion, AnimatePresence } from "framer-motion";
import type { Suggestion } from "../types";
import { X } from "lucide-react";
import { SuggestionsList } from "./SuggestionsList";

interface SuggestionsSheetProps {
    isOpen: boolean;
    onClose: () => void;
    suggestions: Suggestion[];
    onSelect: (word: string) => void;
}

export const SuggestionsSheet = ({ isOpen, onClose, suggestions, onSelect }: SuggestionsSheetProps) => {

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-40 lg:hidden"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-wordle-card rounded-t-3xl shadow-xl max-h-[80vh] flex flex-col lg:hidden"
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

                        <SuggestionsList suggestions={suggestions} onSelect={onSelect} />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
