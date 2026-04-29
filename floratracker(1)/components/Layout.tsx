import React from 'react';
import { Home, BarChart2, PlusCircle, Sparkles, User, Leaf } from 'lucide-react';
import { View } from '../types.ts';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
}

export default function Layout({ children, activeView, onViewChange }: LayoutProps) {
  const navItems = [
    { id: 'garden', label: 'Garden', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'add', label: 'Add', icon: PlusCircle },
    { id: 'assistant', label: 'Assistant', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background-primary shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary-container fill-primary-container" />
          <span className="text-xl font-bold tracking-tighter text-primary-container">FloraTracker</span>
        </div>
        <button className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
          <User className="w-5 h-5 text-zinc-600" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-lg border-t border-zinc-100 flex justify-around items-center h-20 px-4 z-50">
        {navItems.map((item) => {
          const isActive = activeView === item.id || (activeView === 'detail' && item.id === 'garden');
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as View)}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                isActive 
                  ? 'text-primary-container font-semibold' 
                  : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-green-50' : ''}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'fill-primary-container/10' : ''}`} />
              </div>
              <span className="text-[11px] uppercase tracking-wider font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
