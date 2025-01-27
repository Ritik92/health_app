'use client'

import Script from 'next/script'
import { useState, useEffect } from 'react'
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GPT_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to process text using Gemini
async function processTextWithGemini(text) {
  const prompt = `
    You are an AI assistant designed to help visually impaired users by processing and optimizing text content for screen readers. Your task is to take the following text extracted from a webpage and transform it into a clear, concise, and easy-to-understand format. Follow these guidelines strictly:

    1. **Summarize the Content**: Identify the main points and remove redundant or irrelevant information. Focus on delivering the core message in a concise manner.

    2. **Simplify the Language**: Use simple, everyday language. Avoid complex sentences, jargon, or technical terms unless absolutely necessary. If technical terms are used, provide a brief explanation.

    3. **Structure the Output**: Organize the content into logical sections with clear headings (e.g., "Introduction", "Key Points", "Conclusion"). Use bullet points or numbered lists where appropriate to improve readability. Do not use symbols like asterisks (*) or other formatting marks that might confuse a screen reader.

    4. **Prioritize Accessibility**:
       - Ensure the text flows naturally when read aloud by a screen reader.
       - Add context where necessary to help users understand the purpose of the content.
       - Highlight actionable items (e.g., buttons, links, or calls to action) and describe their functions clearly.

    5. **Tone and Style**: Use a friendly and empathetic tone. Assume the user has limited vision and may rely entirely on auditory cues.

    6. **Length**: Keep the output concise but informative. Aim for a length that is easy to follow without overwhelming the user.

    7. **Avoid Symbols**: Do not use any symbols (e.g., asterisks, dashes, or slashes) unless they are absolutely necessary for clarity. Screen readers may misinterpret these symbols.

    Here is the text to process:
    "${text}"

    Provide the optimized output below:
  `;

  const result = await model.generateContent(prompt);

  // Remove any remaining asterisks or unwanted symbols from the response
  const processedText = result.response.text().replace(/\*/g, '').trim();

  return processedText;
}// ScreenReader Component
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

  const startReading = async () => {
    if (!supported) {
      alert('Text to speech is not supported in your browser');
      return;
    }

    window.speechSynthesis.cancel();

    const text = getAllTextContent();
    const processedText = await processTextWithGemini(text);

    const utterance = new SpeechSynthesisUtterance(processedText);
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => {
      setSpeaking(false);
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