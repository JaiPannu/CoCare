import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Puzzle, RefreshCw, Trophy } from "lucide-react";

const shapes = [
  { name: "Circle", emoji: "🔵", sides: 0 },
  { name: "Triangle", emoji: "🔺", sides: 3 },
  { name: "Square", emoji: "🟦", sides: 4 },
  { name: "Pentagon", emoji: "⭐", sides: 5 },
  { name: "Hexagon", emoji: "⬢", sides: 6 }
];

interface ShapePuzzleGameProps {
  onClose: () => void;
  onWin: (score: number) => void;
}

export function ShapePuzzleGame({ onClose, onWin }: ShapePuzzleGameProps) {
  const [currentShape, setCurrentShape] = useState(shapes[0]);
  const [options, setOptions] = useState<typeof shapes>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameWon, setGameWon] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  const generateRound = () => {
    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
    setCurrentShape(targetShape);
    
    const wrongShapes = shapes.filter(s => s.name !== targetShape.name);
    const shuffled = [targetShape, ...wrongShapes.slice(0, 2)].sort(() => Math.random() - 0.5);
    setOptions(shuffled);
    setFeedback("");
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleShapeClick = (selectedShape: typeof shapes[0]) => {
    if (selectedShape.name === currentShape.name) {
      setScore(score + 15);
      setFeedback("Correct! Well done! 🎉");
      
      if (round >= 8) {
        setGameWon(true);
        setTimeout(() => {
          onWin(score + 15);
        }, 1500);
      } else {
        setTimeout(() => {
          setRound(round + 1);
          generateRound();
        }, 1500);
      }
    } else {
      setScore(Math.max(0, score - 5));
      setFeedback(`Not quite! That's a ${selectedShape.name}. Try again! 🤔`);
    }
  };

  const resetGame = () => {
    setScore(0);
    setRound(1);
    setGameWon(false);
    setFeedback("");
    generateRound();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5 text-green-500" />
            Shape Puzzle
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">Score: {score}</Badge>
          <Badge variant="outline">Round: {round}/8</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!gameWon ? (
          <>
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Find the {currentShape.name}!</p>
              <div className="text-6xl mb-4">{currentShape.emoji}</div>
              {feedback && (
                <p className={`text-sm font-medium ${
                  feedback.includes("Correct") ? "text-green-600" : "text-orange-600"
                }`}>
                  {feedback}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {options.map((shape, index) => (
                <button
                  key={index}
                  onClick={() => handleShapeClick(shape)}
                  className="flex flex-col items-center p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all hover:scale-105 active:scale-95 bg-background hover:bg-muted/50"
                  disabled={!!feedback}
                >
                  <div className="text-3xl mb-1">{shape.emoji}</div>
                  <div className="text-xs text-muted-foreground">{shape.name}</div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <Trophy className="h-16 w-16 mx-auto text-yellow-500 animate-bounce" />
            <h3 className="text-xl font-bold">Amazing Work!</h3>
            <p className="text-lg">You completed all 8 rounds!</p>
            <p className="text-lg">Final Score: {score} points</p>
            <p className="text-sm text-muted-foreground">You earned {Math.floor(score / 10) + 10} coins!</p>
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