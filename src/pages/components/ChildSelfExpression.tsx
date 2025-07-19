import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Coffee, Gamepad2, BookOpen, Users, Utensils } from "lucide-react";

interface ExpressionOption {
  id: string;
  emoji: string;
  text: string;
  icon: React.ComponentType<any>;
  variant: "play" | "calm" | "rest" | "child";
}

const expressionOptions: ExpressionOption[] = [
  {
    id: "happy",
    emoji: "😊",
    text: "I'm happy!",
    icon: Heart,
    variant: "play",
  },
  {
    id: "break",
    emoji: "✋",
    text: "I need a break",
    icon: Coffee,
    variant: "rest",
  },
  {
    id: "play",
    emoji: "🎮",
    text: "I want to play",
    icon: Gamepad2,
    variant: "play",
  },
  {
    id: "story",
    emoji: "📚",
    text: "Story time",
    icon: BookOpen,
    variant: "calm",
  },
  {
    id: "friends",
    emoji: "👥",
    text: "I want friends",
    icon: Users,
    variant: "child",
  },
  {
    id: "hungry",
    emoji: "🍎",
    text: "I'm hungry",
    icon: Utensils,
    variant: "play",
  },
];

interface ChildSelfExpressionProps {
  onExpression?: (expression: string) => void;
}

export function ChildSelfExpression({ onExpression }: ChildSelfExpressionProps) {
  const [selectedExpression, setSelectedExpression] = useState<string | null>(null);
  const [recentExpressions, setRecentExpressions] = useState<string[]>([]);

  const handleExpressionClick = (option: ExpressionOption) => {
    setSelectedExpression(option.id);
    setRecentExpressions(prev => [option.text, ...prev.slice(0, 2)]);
    onExpression?.(option.text);
    
    // Clear selection after animation
    setTimeout(() => setSelectedExpression(null), 1000);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">💬</span>
          How are you feeling?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {expressionOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = selectedExpression === option.id;
            
            return (
              <Button
                key={option.id}
                variant={isSelected ? option.variant : "child"}
                size="child"
                onClick={() => handleExpressionClick(option)}
                className={`flex flex-col h-auto p-6 gap-2 transition-all duration-300 ${
                  isSelected ? "animate-gentle-bounce scale-110" : "hover:scale-105"
                }`}
              >
                <span className="text-3xl">{option.emoji}</span>
                <span className="text-sm font-medium text-center leading-tight">
                  {option.text}
                </span>
              </Button>
            );
          })}
        </div>

        {recentExpressions.length > 0 && (
          <div className="bg-muted/50 rounded-2xl p-4">
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              Recent messages:
            </h4>
            <div className="space-y-1">
              {recentExpressions.map((expression, index) => (
                <div
                  key={index}
                  className="text-sm bg-background rounded-lg p-2 border"
                >
                  "{expression}"
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
