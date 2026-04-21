/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MessageCircle, MapPin, ClipboardCheck, Home as HomeIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Home from './components/Home';
import Chat from './components/Chat';
import RecommendationForm from './components/RecommendationForm';
import ClinicFinder from './components/ClinicFinder';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Chat', path: '/chat', icon: MessageCircle },
    { name: 'Finder', path: '/clinics', icon: MapPin },
    { name: 'Adviser', path: '/recommendations', icon: ClipboardCheck },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-5xl mx-auto bg-sage-50">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r border-sage-200 p-6 gap-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-sage-700">Smart SRH</h1>
          <p className="text-xs text-slate-500">Kenya's Private Assistant</p>
        </div>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              location.pathname === item.path 
                ? "bg-sage-600 text-white shadow-md active:scale-95" 
                : "text-slate-600 hover:bg-sage-100"
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
        
        <div className="mt-auto p-4 bg-sage-50 rounded-2xl border border-sage-100">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Disclaimer</p>
          <p className="text-[10px] text-slate-400">Not a substitute for professional medical advice.</p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden h-screen relative">
        <header className="md:hidden bg-white border-b border-sage-200 p-4 flex items-center justify-between shadow-sm">
          <h1 className="text-lg font-bold text-sage-700">Smart SRH</h1>
          <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center">
            <span className="text-sage-600 font-bold text-xs">KE</span>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden bg-white border-t border-sage-200 px-6 py-3 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                location.pathname === item.path ? "text-sage-600 scale-110" : "text-slate-400"
              )}
            >
              <item.icon size={22} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
              <span className="text-[10px] whitespace-nowrap">{item.name}</span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/recommendations" element={<RecommendationForm />} />
          <Route path="/clinics" element={<ClinicFinder />} />
        </Routes>
      </Layout>
    </Router>
  );
}

