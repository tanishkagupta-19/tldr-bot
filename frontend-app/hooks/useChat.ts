'use client';

import { useState } from 'react';
import { chatWithArticle } from '../lib/api';
import type { ChatResponse } from '../lib/types';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface UseChatResult {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sendMessage: (message: string, articleId: number) => Promise<void>;
}

export default function useChat(initialMessages: Message[] = []): UseChatResult {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string, articleId: number) => {
    if (!message.trim()) return;

    // Add user message immediately
    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await chatWithArticle(articleId, message);
      const botMessage: Message = {
        id: messages.length + 2,
        text: response.answer,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // Add error message to chat
      const errorMessage: Message = {
        id: messages.length + 2,
        text: 'Sorry, I encountered an error while processing your message.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
}