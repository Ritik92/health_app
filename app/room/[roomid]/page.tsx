"use client";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

// Speech to Text Component
const SpeechToText = ({ onTranscriptChange }: { onTranscriptChange: (text: string) => void }) => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const startListening = () => {
    if (!supported) return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      onTranscriptChange(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Restart recognition automatically
      if (recognitionRef.current) {
        startListening();
      }
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  if (!supported) {
    return (
      <div className="text-red-500 p-4">
        Speech to text is not supported in this browser
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`px-4 py-2 rounded-lg ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {isListening ? 'Stop Transcription' : 'Start Transcription'}
      </button>
    </div>
  );
};

// Main Room Component
const Room = ({ params }: { params: Promise<{ roomid: string }> }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // Handle new transcripts
  const handleTranscript = (text: string) => {
    setTranscripts(prev => {
      // Keep only the last 10 transcripts
      const newTranscripts = [...prev, text].slice(-10);
      return newTranscripts;
    });
  };

  // Auto-scroll transcript container
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcripts]);

  useEffect(() => {
    const setupMeeting = async () => {
      const { roomid } = await params;
      const roomID = roomid;
      const fullName = session?.user?.name || 'Enter Your Name Here';

      if (elementRef.current) {
        const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!);
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          uuid(),
          fullName || "user" + Date.now(),
          720
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
          container: elementRef.current,
          sharedLinks: [
            {
              name: "Shareable link",
              url: window.location.protocol + "//" + window.location.host + window.location.pathname + "?roomID=" + roomID,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          maxUsers: 10,
        });
      }
    };

    setupMeeting();
  }, [params, session?.user?.name]);

  return (
    <div className="relative w-full h-screen">
      <div className="w-full h-screen" ref={elementRef}></div>
      
      {/* Transcription Panel */}
      <div className="absolute right-4 top-4 w-80 bg-white rounded-lg shadow-lg p-4 z-10">
        <div className="mb-4">
          <SpeechToText onTranscriptChange={handleTranscript} />
        </div>
        
        <div 
          ref={transcriptContainerRef}
          className="h-60 overflow-y-auto p-4 bg-gray-50 rounded-lg"
        >
          {transcripts.map((text, index) => (
            <div 
              key={index} 
              className="mb-2 p-2 bg-white rounded shadow"
            >
              {text}
            </div>
          ))}
          {transcripts.length === 0 && (
            <div className="text-gray-500 text-center">
              Start transcription to see speech-to-text here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;