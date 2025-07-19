import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, RefreshCw, Trophy } from "lucide-react";

const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

interface MemoryGameProps {
  onClose: () => void;
  onWin: (score: number) => void;
}

export function MemoryGame({ onClose, onWin }: MemoryGameProps) {
  const [cards, setCards] = useState<{id: number, emoji: string, flipped: boolean, matched: boolean}[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = () => {
    const gameEmojis = emojis.slice(0, 6);
    const cardPairs = [...gameEmojis, ...gameEmojis];
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    
    setCards(shuffled.map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false
    })));
    setFlippedCards([]);
    setScore(0);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(card => card.id === first);
      const secondCard = cards.find(card => card.id === second);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, matched: true }
              : card
          ));
          setScore(score + 20);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, flipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(moves + 1);
    }
  }, [flippedCards, cards, score, moves]);

  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every(card => card.matched);
    if (allMatched && !gameWon) {
      setGameWon(true);
      const finalScore = Math.max(100 - moves * 5, 20);
      setScore(finalScore);
      // Small delay before awarding coins
      setTimeout(() => {
        onWin(finalScore);
      }, 1000);
    }
  }, [cards, gameWon, moves, onWin]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2) return;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched) return;

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, flipped: true } : c
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Memory Game
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">Score: {score}</Badge>
          <Badge variant="outline">Moves: {moves}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!gameWon ? (
          <>
            <p className="text-center text-sm text-muted-foreground">
              Find matching pairs of animals!
            </p>
            <div className="grid grid-cols-4 gap-2">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`aspect-square rounded-lg border-2 text-2xl font-bold transition-all ${
                    card.flipped || card.matched
                      ? "bg-primary/10 border-primary"
                      : "bg-muted hover:bg-muted/80 border-border hover:border-primary/50"
                  } ${card.matched ? "opacity-60" : ""}`}
                  disabled={card.flipped || card.matched}
                >
                  {card.flipped || card.matched ? card.emoji : "?"}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <Trophy className="h-16 w-16 mx-auto text-yellow-500 animate-bounce" />
            <h3 className="text-xl font-bold">Congratulations!</h3>
            <p className="text-lg">You completed the game in {moves} moves!</p>
            <p className="text-lg">Final Score: {score} points</p>
            <p className="text-sm text-muted-foreground">You earned {Math.floor(score / 10) + 5} coins!</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={initializeGame} className="flex items-center gap-2">
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