'use client'

import Script from 'next/script'
import { useState, useEffect } from 'react'

// ScreenReader Component
const ScreenReader = () => {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported('speechSynthesis' in window);
  }, []);

  const getAllTextContent = () => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          if (node.parentElement.offsetHeight === 0 || 
              node.parentElement.tagName.toLowerCase() === 'script' ||
              node.parentElement.tagName.toLowerCase() === 'style') {
            return NodeFilter.FILTER_REJECT;
          }
          return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
      }
    );

    let textContent = [];
    let currentNode;
    
    while (currentNode = walker.nextNode()) {
      textContent.push(currentNode.textContent.trim());
    }

    return textContent.join(' ');
  };

  const startReading = () => {
    if (!supported) {
      alert('Text to speech is not supported in your browser');
      return;
    }

    window.speechSynthesis.cancel();

    const text = getAllTextContent();
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => {
      setSpeaking(false);
      alert('An error occurred while reading the content');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  if (!supported) {
    return (
      <button 
        className="px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
        disabled
      >
        Screen Reader Not Supported
      </button>
    );
  }

  return (
    <button
      onClick={speaking ? stopReading : startReading}
      className={`fixed bottom-20 right-4 z-50 px-6 py-3 rounded-full shadow-lg font-medium 
        ${speaking 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-blue-500 hover:bg-blue-600 text-white'
        } 
        transition-colors duration-200`}
      aria-label={speaking ? 'Stop reading screen content' : 'Read screen content'}
    >
      {speaking ? 'Stop Reading' : 'Read Screen'}
    </button>
  );
};

// Main Chatbot Component with Screen Reader
export default function ChatbotEmbed() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!document.querySelector('zapier-interfaces-chatbot-embed')) {
      const chatbot = document.createElement('zapier-interfaces-chatbot-embed');
      chatbot.setAttribute('is-popup', 'true');
      chatbot.setAttribute('chatbot-id', 'cm650ln3d007uv5riewjmmsqn');
      document.body.appendChild(chatbot);
    }
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Script
        src="https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js"
        type="module"
        strategy="afterInteractive"
        onLoad={() => setIsLoaded(true)}
      />
      
      {/* Only render ScreenReader after chatbot script is loaded */}
      {isLoaded && <ScreenReader />}
      
      {/* Optional loading indicator */}
      {!isLoaded && (
        <div className="fixed bottom-20 right-4 z-50 px-6 py-3 bg-gray-200 rounded-full shadow-lg">
          Loading...
        </div>
      )}
    </>
  );
}