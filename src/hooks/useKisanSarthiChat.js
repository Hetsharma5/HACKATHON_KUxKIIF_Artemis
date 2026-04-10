import { useState, useCallback } from 'react';
import { generateSystemPrompt } from '../utils/aiPrompt';

export function useKisanSarthiChat(fieldData, language = 'en') {
  const [messages, setMessages] = useState(() => {
    // Initialize with system prompt
    const systemContent = generateSystemPrompt(fieldData, language);
    return [{ role: 'system', content: systemContent }];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    // Append user message
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    // Initial placeholder for assistant message during streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      // Connect to local Ollama server
      // Note: Make sure Ollama server is running with OLLAMA_ORIGINS="*" if running in browser
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemma:2b', // or 'gemma' depending on installation
          messages: newMessages,
          stream: true
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API Error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let assistantResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(l => l.trim().length > 0);
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              assistantResponse += data.message.content;
              // Append streamed chunks to the assistant message
              setMessages(prev => {
                const newState = [...prev];
                // Update the last message (the assistant placeholder)
                newState[newState.length - 1] = { 
                  role: 'assistant', 
                  content: assistantResponse 
                };
                return newState;
              });
            }
          } catch (e) {
            console.warn('Error parsing stream chunk', e);
          }
        }
      }
    } catch (err) {
      console.error('Chat Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const resetChat = useCallback(() => {
    // When the farmer taps "Try Another Crop", wipe clean and regenerate system prompt
    const systemContent = generateSystemPrompt(fieldData, language);
    setMessages([{ role: 'system', content: systemContent }]);
  }, [fieldData, language]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetChat
  };
}
