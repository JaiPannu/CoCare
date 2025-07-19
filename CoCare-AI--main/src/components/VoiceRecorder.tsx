import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function VoiceRecorder({ onTranscription, placeholder = "Click to start recording...", disabled = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
        setIsRecording(false);
        if (transcript) {
          onTranscription(transcript);
          setTranscript("");
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [transcript, onTranscription, toast]);

  const startRecording = () => {
    if (!recognitionRef.current || disabled) return;

    try {
      setTranscript("");
      recognitionRef.current.start();
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone.",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not start recording. Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;

    recognitionRef.current.stop();
    toast({
      title: "Recording Stopped",
      description: "Processing your speech...",
    });
  };

  if (!isSupported) {
    return (
      <div className="text-sm text-muted-foreground p-2 border border-dashed rounded">
        Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari for voice features.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full">
      {!isRecording ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={startRecording}
          disabled={disabled}
          className="flex items-center gap-2 hover:bg-primary/10 hover:border-primary/20 shrink-0"
        >
          <Mic className="h-4 w-4" />
          Voice
        </Button>
      ) : (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={stopRecording}
          className="flex items-center gap-2 animate-pulse shrink-0"
        >
          <Square className="h-4 w-4" />
          Stop
        </Button>
      )}
      
      {isListening && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Listening...
        </div>
      )}

      {transcript && (
        <div className="flex-1 p-2 bg-muted/50 rounded border text-sm">
          <p className="text-muted-foreground text-xs mb-1">Live transcript:</p>
          <p className="text-foreground">{transcript}</p>
        </div>
      )}
    </div>
  );
}

// Extend the Window interface to include speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}