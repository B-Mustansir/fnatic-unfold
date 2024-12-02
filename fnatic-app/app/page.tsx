'use client'

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Shield, TrendingUp, Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ModernAIChatbot from "@/components/aiChatBot";

export default function Home() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-16 relative">
        {/* Existing content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-500">
            AI-ML based AMM <br /> to protect your Liquidity
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8">
            Become an LP with confidence - Buy, sell, and explore your favorite tokens.
          </p>
          <Link href="/trade" passHref>
            <Button
              size="lg"
              className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Get started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>

        {/* Feature grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Lightning Fast", description: "Execute trades with minimal latency" },
            { icon: Shield, title: "Secure", description: "Your assets are protected by cutting-edge security" },
            { icon: TrendingUp, title: "Grow Your Portfolio", description: "Access a wide range of DeFi opportunities" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all duration-300 border border-gray-700"
            >
              <feature.icon className="h-12 w-12 text-violet-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Background effects */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-900 rounded-full filter blur-[120px] opacity-20 animate-pulse" />

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-violet-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 1}px`,
                height: `${Math.random() * 6 + 1}px`,
                opacity: Math.random() * 0.5 + 0.1,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Chatbot toggle button */}
        <motion.button
          className="fixed bottom-4 right-4 bg-violet-500 text-white p-3 rounded-full shadow-lg hover:bg-violet-600 transition-colors duration-300 z-50"
          onClick={toggleChatbot}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bot size={24} />
        </motion.button>

        {/* Chatbot component */}
        <AnimatePresence>
          {isChatbotOpen && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="fixed top-0 right-0 w-full sm:w-96 h-full z-50"
            >
              <ModernAIChatbot onClose={toggleChatbot} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

