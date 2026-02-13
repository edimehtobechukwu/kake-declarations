'use client';

import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { DeclarationForm } from "@/components/DeclarationForm";
import { HistoryList } from "@/components/HistoryList";
import { Footer } from "@/components/Footer";
import { getLatestDeclaration, saveDeclaration, Declaration } from "@/lib/storage";

export default function Home() {
  const [currentDeclaration, setCurrentDeclaration] = useState<Declaration | null>(null);

  useEffect(() => {
    // Load initial state
    const latest = getLatestDeclaration();
    setCurrentDeclaration(latest);

    // Request notification permission early if possible
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleDeclare = (text: string, author: 'Kaine' | 'Kelvin') => {
    const newDeclaration = saveDeclaration(text, author);
    setCurrentDeclaration(newDeclaration);
  };

  return (
    <div className="min-h-screen bg-[#F0F8FF] text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900 flex flex-col overflow-x-hidden relative">
      <Toaster position="top-center" richColors theme="light" />

      {/* Background Gradient Blob */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-200/40 rounded-full blur-[100px] mix-blend-multiply animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-200/40 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-sky-200/40 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000" />
      </div>

      <Header />

      <main className="flex-grow flex flex-col items-center w-full max-w-4xl mx-auto px-6 py-8 space-y-12">
        <Hero declaration={currentDeclaration} />
        <DeclarationForm onDeclare={handleDeclare} />
        <HistoryList newDeclaration={currentDeclaration} />
      </main>

      <Footer />
    </div>
  );
}
