'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User, Sparkles, X } from 'lucide-react'

type Message = {
  id: number
  text: string
  sender: 'user' | 'bot'
}

interface ModernAIChatbotProps {
  onClose: () => void;
}

export default function ModernAIChatbot({ onClose }: ModernAIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: input, sender: 'user' }])
      setInput('')
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { id: prev.length + 1, text: "I'm processing your request. Please wait a moment.", sender: 'bot' }])
      }, 1000)
    }
  }

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden rounded-lg shadow-2xl bg-gray-900">
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            'linear-gradient(to right, #350a64, #0e0b2d)',
            'linear-gradient(to right, #0e0b2d, #350a64)',
            'linear-gradient(to right, #350a64, #0e0b2d)',
          ],
        }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between p-4 bg-black bg-opacity-40 border-b border-purple-700"
      >
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">AI Chatbot</h1>
        <div className="flex items-center space-x-2">
          <Sparkles className="text-purple-400" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </Button>
        </div>
      </motion.div>
      <ScrollArea className="relative z-10 flex-grow p-4" ref={scrollAreaRef}>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className={`w-8 h-8 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                  <AvatarFallback>{message.sender === 'user' ? <User className="text-purple-200" /> : <Bot className="text-purple-200" />}</AvatarFallback>
                </Avatar>
                <div className={`px-4 py-2 rounded-2xl ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                    : 'bg-gradient-to-r from-gray-800 to-gray-700'
                } max-w-xs shadow-lg`}>
                  <p className="text-sm text-white">{message.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 p-4 bg-black bg-opacity-40 border-t border-purple-700"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow bg-gray-800 border-purple-600 text-purple-100 placeholder-purple-400 rounded-full px-4"
          />
          <Button type="submit" className="bg-gradient-to-r from-purple-900 to-pink-800 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

