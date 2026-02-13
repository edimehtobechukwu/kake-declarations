'use client';

import { motion } from "motion/react";
import { SettingsDrawer } from "./SettingsDrawer";

export function Header() {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full py-8 flex justify-center items-center relative px-6"
        >
            <div className="absolute right-6 top-8">
                <SettingsDrawer />
            </div>
            <div className="text-center">
                <h1 className="font-serif text-3xl md:text-4xl text-foreground tracking-tight">KaKe</h1>
                <p className="text-xs font-medium text-primary/60 tracking-widest uppercase mt-1">Kaine & Kelvin</p>
            </div>
        </motion.header>
    );
}
