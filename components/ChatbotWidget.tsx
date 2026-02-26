/**
 * Björn — Assistant IA Kafé Stockholm
 * Guide suédois : carte, Fika, horaires, allergènes, privatisation
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const INTRO_MESSAGE =
  'Hej ! Je suis Björn, votre guide suédois du Kafé Stockholm. Je peux vous aider avec la carte, les horaires, les allergènes, la privatisation ou une recommandation. Que puis-je faire pour vous aujourd\'hui ?';

const QUICK_SUGGESTIONS = [
  'Recommandation plat',
  'Horaires d\'ouverture',
  'Allergènes d\'un plat',
  'Privatisation / événement',
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: INTRO_MESSAGE,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chatbot/chat`, {
        message: inputValue,
        threadId: threadId,
      });

      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (response.data.threadId) {
        setThreadId(response.data.threadId);
      }
    } catch (error: any) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content:
          error.response?.data?.error ||
          'Désolé, une erreur est survenue. Réessayez ou appelez-nous au 04 78 30 97 06.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-40 bg-kafe-primary text-white rounded-full w-14 h-14 md:w-16 md:h-16 shadow-2xl flex items-center justify-center hover:opacity-90 transition-opacity bottom-4 right-4 md:bottom-6 md:right-6"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Fermer Björn' : 'Ouvrir Björn'}
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed z-30 flex flex-col overflow-hidden bg-white shadow-2xl border-2 border-kafe-primary/20
              bottom-24 right-4 left-auto top-auto w-[min(320px,calc(100vw-2rem))] h-[min(520px,calc(100vh-7rem))] rounded-2xl
              md:right-6 md:w-[400px] md:h-[600px] md:max-h-[calc(100vh-6rem)]"
          >
            <div className="bg-kafe-primary text-white p-3 md:p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center font-heading text-base md:text-lg shrink-0">
                  B
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-semibold text-base md:text-lg">Björn</h3>
                  <p className="text-xs md:text-sm text-white/90 truncate">
                    {isLoading ? 'En train d\'écrire...' : 'Guide Kafé Stockholm'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition p-2 -m-2 touch-manipulation"
                aria-label="Fermer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-kafe-bg/50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-3 py-2 md:px-4 ${
                      message.role === 'user'
                        ? 'bg-kafe-primary text-white'
                        : 'bg-white text-kafe-charcoal shadow-sm border border-kafe-pearl'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-white/80' : 'text-kafe-charcoal/50'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-kafe-pearl">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-kafe-primary/60 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-kafe-primary/60 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <div
                        className="w-2 h-2 bg-kafe-primary/60 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="px-3 md:px-4 py-2 bg-white border-t border-kafe-pearl shrink-0">
                <p className="text-xs text-kafe-charcoal/60 mb-2">Suggestions :</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(suggestion)}
                      className="text-xs bg-kafe-pearl/50 hover:bg-kafe-primary/10 text-kafe-charcoal px-3 py-2 md:py-1.5 rounded-full transition border border-kafe-pearl touch-manipulation"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 md:p-4 bg-white border-t border-kafe-pearl shrink-0">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Votre question..."
                  disabled={isLoading}
                  className="flex-1 min-w-0 px-3 py-2.5 md:px-4 md:py-2 border border-kafe-pearl rounded-full focus:outline-none focus:ring-2 focus:ring-kafe-primary text-kafe-charcoal text-base disabled:bg-kafe-pearl/30"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-kafe-primary hover:bg-kafe-primary/90 text-white p-2.5 md:p-2 rounded-full disabled:opacity-50 transition shrink-0 touch-manipulation"
                  aria-label="Envoyer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
