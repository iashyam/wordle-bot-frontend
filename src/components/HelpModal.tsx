import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-wordle-bg border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-slate-700/50 relative">
                            <h2 className="text-2xl font-bold text-white tracking-wide">How to Play</h2>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-2 rounded-full absolute right-4"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 text-slate-300 space-y-5 leading-relaxed">
                            <ol className="list-decimal list-outside ml-4 space-y-4">
                                <li>
                                    <span className="text-white font-medium">Select a suggested word</span> from the list, or tap the empty tiles to type your own start word using your keyboard.
                                </li>
                                <li>
                                    <span className="text-wordle-yellow font-medium">Enter this word</span> into the official Wordle app to reveal the actual color pattern.
                                </li>
                                <li>
                                    <span className="text-white font-medium">Match the colors here</span> by repeatedly tapping the letter tiles to cycle their colors (Gray &rarr; Yellow &rarr; Green).
                                </li>
                                <li>
                                    Press <span className="bg-wordle-green/20 text-wordle-green px-2 py-0.5 rounded font-bold">Apply Pattern</span> to instantly calculate the best suggestions for your next guess!
                                </li>
                            </ol>

                            <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-col gap-2 relative">
                                <p className="text-sm text-slate-400 text-center">
                                    Good luck finding the word!
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-800/50 flex justify-center border-t border-slate-700/50">
                            <button
                                onClick={onClose}
                                className="w-full max-w-[200px] py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
                            >
                                Got it
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
