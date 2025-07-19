import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, RefreshCw, Trophy } from "lucide-react";

const colors = [
  { name: "Red", color: "bg-red-500", hex: "#ef4444" },
  { name: "Blue", color: "bg-blue-500", hex: "#3b82f6" },
  { name: "Green", color: "bg-green-500", hex: "#22c55e" },
  { name: "Yellow", color: "bg-yellow-500", hex: "#eab308" },
  { name: "Purple", color: "bg-purple-500", hex: "#a855f7" },
  { name: "Pink", color: "bg-pink-500", hex: "#ec4899" },
  { name: "Orange", color: "bg-orange-500", hex: "#f97316" },
  { name: "Cyan", color: "bg-cyan-500", hex: "#06b6d4" }
];

interface ColorMatchGameProps {
  onClose: () => void;
  onWin: (score: number) => void;
}

export function ColorMatchGame({ onClose, onWin }: ColorMatchGameProps) {
  const [targetColor, setTargetColor] = useState(colors[0]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(true);
  const [showColors, setShowColors] = useState(colors.slice(0, 4));

  useEffect(() => {
    if (timeLeft > 0 && gameActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      // Small delay to show final score before calling onWin
      setTimeout(() => {
        onWin(score);
      }, 1000);
    }
  }, [timeLeft, gameActive, score, onWin]);

  const generateNewRound = () => {
    const newTarget = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(newTarget);
    
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    const gameColors = shuffled.slice(0, 3);
    if (!gameColors.find(c => c.name === newTarget.name)) {
      gameColors[Math.floor(Math.random() * 3)] = newTarget;
    }
    setShowColors(gameColors.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateNewRound();
  }, []);

  const handleColorClick = (clickedColor: typeof colors[0]) => {
    if (!gameActive) return;
    
    if (clickedColor.name === targetColor.name) {
      setScore(score + 10);
      generateNewRound();
    } else {
      setScore(Math.max(0, score - 5));
    }
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    generateNewRound();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-500" />
            Color Match
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">Score: {score}</Badge>
          <Badge variant={timeLeft > 10 ? "default" : "destructive"}>
            Time: {timeLeft}s
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {gameActive ? (
          <>
            <div className="text-center">
              <p className="text-lg font-medium mb-4">Click the {targetColor.name} color!</p>
              <div 
                className={`w-20 h-20 mx-auto rounded-lg ${targetColor.color} shadow-lg border-4 border-white`}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {showColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorClick(color)}
                  className={`w-full h-16 ${color.color} rounded-lg border-2 border-gray-300 hover:border-gray-600 transition-all hover:scale-105 active:scale-95`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
            <h3 className="text-xl font-bold">Time's Up!</h3>
            <p className="text-lg">Final Score: {score} points</p>
            <p className="text-sm text-muted-foreground">You earned {Math.floor(score / 10) + 5} coins!</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={resetGame} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Play Again
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}