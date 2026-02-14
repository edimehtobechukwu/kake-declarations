import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles } from "lucide-react";
import { getSettings } from "@/lib/storage";

interface DeclarationFormProps {
    onDeclare: (text: string, author: 'Kaine' | 'Kelvin') => void;
}

export function DeclarationForm({ onDeclare }: DeclarationFormProps) {
    const [text, setText] = useState("");
    const [author, setAuthor] = useState<'Kaine' | 'Kelvin'>("Kaine");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            toast.error("Please enter a declaration.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Get email preferences
            const { kaineEmail, kelvinEmail } = getSettings();
            const recipients = [kaineEmail, kelvinEmail].filter(Boolean);

            // Call API
            const res = await fetch('/api/declarations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: text, author, recipients })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.details || data.error || "Unknown server error");
            }

            // Browser Notification
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification("New Declaration from " + author, { body: text });
            }

            // Call parent handler (Sync to LocalStorage)
            onDeclare(text, author);

            // Reset
            setText("");
            toast.success("Notification sent");

        } catch (error: any) {
            console.error("Failed to sync/email declaration", error);
            toast.error(`Failed: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full max-w-2xl relative z-10"
        >
            <form onSubmit={handleSubmit} className="relative group">
                <div className={cn(
                    "absolute inset-0 bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500",
                    isFocused ? "shadow-[0_20px_50px_rgba(59,130,246,0.12)] scale-[1.01]" : "scale-100"
                )} />

                <div className="relative p-3 bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white/60">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between px-6 pt-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">I declare that...</span>

                            <div className="flex bg-slate-100/80 p-1 rounded-full relative isolate">
                                {/* Simple toggle implementation using absolute positioning for the background pill */}
                                <div
                                    className={cn(
                                        "absolute inset-y-1 bg-white rounded-full shadow-sm z-[-1] transition-all duration-300 ease-out w-[calc(50%-4px)]",
                                        author === 'Kelvin' ? "left-[calc(50%)]" : "left-1"
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setAuthor('Kaine')}
                                    className={cn(
                                        "px-5 py-1.5 text-xs font-bold rounded-full transition-colors z-10 w-24",
                                        author === 'Kaine' ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    KAINE
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAuthor('Kelvin')}
                                    className={cn(
                                        "px-5 py-1.5 text-xs font-bold rounded-full transition-colors z-10 w-24",
                                        author === 'Kelvin' ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    KELVIN
                                </button>
                            </div>
                        </div>

                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Type your daily declaration here..."
                            className="w-full bg-transparent border-none p-6 text-2xl md:text-3xl text-slate-800 placeholder:text-slate-300/80 focus:ring-0 resize-none font-serif min-h-[140px] leading-relaxed selection:bg-blue-100"
                        />

                        <div className="px-3 pb-3 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting || !text.trim()}
                                className={cn(
                                    "flex items-center gap-2 px-8 py-3.5 rounded-[1.2rem] font-semibold transition-all duration-300 text-sm tracking-wide",
                                    text.trim()
                                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[1px]"
                                        : "bg-slate-100 text-slate-300 cursor-not-allowed"
                                )}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Send Your Declaration</span>
                                        <Sparkles className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </motion.div>
    );
}
