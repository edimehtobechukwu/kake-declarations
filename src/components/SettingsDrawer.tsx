import { Drawer } from "vaul";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSettings, saveSettings, UserSettings } from "@/lib/storage";
import { Settings, Save, X, Mail } from "lucide-react";
import { motion } from "motion/react";

export function SettingsDrawer() {
    const [open, setOpen] = useState(false);
    const [emails, setEmails] = useState<UserSettings>({
        kaineEmail: "",
        kelvinEmail: ""
    });

    useEffect(() => {
        if (open) {
            setEmails(getSettings());
        }
    }, [open]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        saveSettings(emails);
        toast.success("Email preferences saved.");
        setOpen(false);
    };

    return (
        <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                <button
                    className="p-3 rounded-full bg-white/50 hover:bg-white text-slate-400 hover:text-slate-800 transition-all duration-300 shadow-sm hover:shadow-md ring-1 ring-slate-100"
                    aria-label="Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </Drawer.Trigger>

            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" />
                <Drawer.Content className="bg-white flex flex-col rounded-t-[2rem] h-auto mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none max-w-lg mx-auto md:max-w-xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                    <div className="p-6 bg-white rounded-t-[2rem] flex-1">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 mb-8" />

                        <div className="max-w-md mx-auto pb-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <Drawer.Title className="font-serif text-3xl font-medium text-slate-900">
                                        Settings
                                    </Drawer.Title>
                                    <p className="text-slate-400 text-sm mt-1">Manage notification preferences</p>
                                </div>
                                <Drawer.Close asChild>
                                    <button className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </Drawer.Close>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="kaine-email" className="text-xs font-bold text-slate-400 uppercase tracking-wider block ml-1">
                                        Kaine's Email
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            id="kaine-email"
                                            type="email"
                                            value={emails.kaineEmail}
                                            onChange={(e) => setEmails({ ...emails, kaineEmail: e.target.value })}
                                            placeholder="kaine@example.com"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-0 focus:border-blue-200 focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="kelvin-email" className="text-xs font-bold text-slate-400 uppercase tracking-wider block ml-1">
                                        Kelvin's Email
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            id="kelvin-email"
                                            type="email"
                                            value={emails.kelvinEmail}
                                            onChange={(e) => setEmails({ ...emails, kelvinEmail: e.target.value })}
                                            placeholder="kelvin@example.com"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-0 focus:border-blue-200 focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-700"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full py-4 bg-slate-900 text-white rounded-[1.2rem] font-medium shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 mt-8"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Preferences
                                </motion.button>
                            </form>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
