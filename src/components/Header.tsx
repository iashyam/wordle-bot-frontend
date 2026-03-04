import { Settings, RefreshCw } from "lucide-react";

interface HeaderProps {
    remainingCount: number | null;
    onReset: () => void;
}

export const Header = ({ remainingCount, onReset }: HeaderProps) => {
    return (
        <header className="flex flex-col items-center pt-6 pb-2 px-4 w-full max-w-lg mx-auto">
            <div className="flex justify-between items-center w-full mb-4">
                <button
                    onClick={onReset}
                    className="text-slate-400 hover:text-white transition-colors bg-transparent border-none p-2"
                    title="Reset Session"
                >
                    <RefreshCw size={24} />
                </button>
                <h1 className="text-2xl font-bold flex items-center gap-2 text-white tracking-widest uppercase">
                    <span className="text-wordle-yellow">Bot</span> Wordle
                </h1>
                <button className="text-slate-400 hover:text-white transition-colors bg-transparent border-none p-2">
                    <Settings size={24} />
                </button>
            </div>

            {remainingCount !== null && (
                <div className="bg-slate-800 rounded-full px-4 py-1.5 text-sm font-medium border border-slate-700 shadow-md">
                    <span className="text-slate-400">Remaining: </span>
                    <span className="text-wordle-yellow font-bold">{remainingCount}</span>
                </div>
            )}
        </header>
    );
};
