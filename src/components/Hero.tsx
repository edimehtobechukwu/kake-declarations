import { motion, AnimatePresence } from "motion/react";
import { Declaration } from "@/lib/storage";
import { Quote } from "lucide-react";

interface HeroProps {
    declaration: Declaration | null;
    isLoading?: boolean;
}

export function Hero({ declaration, isLoading = false }: HeroProps) {
    return (
        <section className="relative w-full flex flex-col items-center justify-center text-center px-4 md:px-0">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full py-24 px-8 rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white/50 shadow-sm flex flex-col items-center justify-center gap-6"
                    >
                        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-slate-400 text-sm font-medium tracking-wide uppercase animate-pulse">Loading inspiration...</p>
                    </motion.div>
                ) : declaration ? (
                    <motion.div
                        key={declaration.id}
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-white/60 -z-10 transition-transform duration-700 group-hover:scale-[1.02]" />

                        <div className="px-8 py-16 md:py-24 md:px-12 relative">
                            <Quote className="w-24 h-24 text-blue-50/80 absolute top-4 left-4 -z-10 rotate-180" />

                            <div className="mb-8 flex justify-center">
                                <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50/80 text-blue-600 text-[11px] font-bold tracking-[0.2em] uppercase ring-1 ring-blue-100/50 shadow-sm">
                                    Today's Word
                                </span>
                            </div>

                            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-slate-800 mb-10 max-w-4xl mx-auto selection:bg-blue-100/50 tracking-tight">
                                "{declaration.text}"
                            </h2>

                            <div className="flex items-center justify-center gap-6">
                                <div className="flex items-center gap-3 bg-white/50 pl-1 pr-4 py-1 rounded-full ring-1 ring-white/50 shadow-sm">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-serif font-bold text-sm shadow-md">
                                        {declaration.author[0]}
                                    </div>
                                    <span className="text-slate-600 font-semibold text-sm tracking-wide">
                                        {declaration.author}
                                    </span>
                                </div>
                                <span className="text-slate-300 text-xs">•</span>
                                <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                                    {new Date(declaration.timestamp).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                                </span>
                            </div>

                            <Quote className="w-24 h-24 text-blue-50/80 absolute bottom-4 right-4 -z-10" />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full py-24 px-8 rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white/50 shadow-sm flex flex-col items-center justify-center gap-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-2 shadow-inner">
                            <Quote className="w-10 h-10 text-blue-300" />
                        </div>
                        <h2 className="font-serif text-3xl md:text-5xl text-slate-400 italic text-center font-light">
                            Waiting for the first declaration...
                        </h2>
                        <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Be the first to inspire today</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
