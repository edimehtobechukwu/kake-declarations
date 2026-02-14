import { useState } from "react";
import { Declaration } from "@/lib/storage";
import { motion, AnimatePresence } from "motion/react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function HistoryList({ history }: { history: Declaration[] }) {
    const [showHistory, setShowHistory] = useState(false);

    const toggleHistory = () => setShowHistory(!showHistory);

    return (
        <div className="w-full max-w-2xl mx-auto px-6 pb-20">
            <motion.button
                onClick={toggleHistory}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm group hover:bg-white/80 transition-all duration-300"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center ring-1 ring-blue-100">
                        <CalendarDays className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Previous Declarations</h3>
                        <p className="text-xs text-slate-400 font-medium">{history.length} recorded</p>
                    </div>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", showHistory ? "rotate-180" : "")} />
            </motion.button>

            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-4 pt-6">
                            {history.length > 0 ? (
                                history.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-6 bg-white rounded-[1.5rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col gap-3 group hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={cn(
                                                "text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full",
                                                item.author === 'Kaine' ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"
                                            )}>
                                                {item.author}
                                            </span>
                                            <span className="text-xs text-slate-300 font-medium">
                                                {new Date(item.timestamp).toLocaleDateString(undefined, {
                                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-slate-700 font-serif italic text-lg leading-relaxed pl-2 border-l-2 border-slate-100 group-hover:border-blue-200 transition-colors">
                                            "{item.text}"
                                        </p>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm italic text-center py-8">No history yet.</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
