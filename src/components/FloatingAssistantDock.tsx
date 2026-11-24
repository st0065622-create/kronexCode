import React, { useState } from 'react';
import FloatingVoiceAssistant from './FloatingVoiceAssistant';
import FloatingGeminiChat from './FloatingGeminiChat';

interface FloatingAssistantDockProps {
  onCommandTrigger?: (command: string, tab?: string) => void;
}

export default function FloatingAssistantDock({ onCommandTrigger }: FloatingAssistantDockProps) {
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end space-x-3">
      {/* Gemini AI Chatbot (Beside Mic Icon) */}
      <FloatingGeminiChat
        isOpen={isGeminiOpen}
        onToggle={() => setIsGeminiOpen(!isGeminiOpen)}
        onNavigate={onCommandTrigger}
      />

      {/* Voice Assistant Mic Icon Button */}
      <FloatingVoiceAssistant
        onCommandTrigger={onCommandTrigger}
        isDocked={true}
      />
    </div>
  );
}
