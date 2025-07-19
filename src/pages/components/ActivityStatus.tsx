import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Moon, AlertTriangle } from "lucide-react";

type ActivityType = "play" | "rest" | "calm" | "alert";

interface ActivityStatusProps {
  currentActivity?: ActivityType;
  onActivityChange?: (activity: ActivityType) => void;
}

export function ActivityStatus({ currentActivity = "calm", onActivityChange }: ActivityStatusProps) {
  const [activity, setActivity] = useState<ActivityType>(currentActivity);

  const activityConfig = {
    play: {
      icon: Play,
      label: "Playing",
      emoji: "🎮",
      description: "Active and engaged",
      variant: "play" as const,
    },
    rest: {
      icon: Moon,
      label: "Resting",
      emoji: "💤",
      description: "Quiet time",
      variant: "rest" as const,
    },
    calm: {
      icon: Pause,
      label: "Calm",
      emoji: "😌",
      description: "Peaceful state",
      variant: "calm" as const,
    },
    alert: {
      icon: AlertTriangle,
      label: "Needs Attention",
      emoji: "🚨",
      description: "Requires support",
      variant: "alert" as const,
    },
  };

  const currentConfig = activityConfig[activity];
  const IconComponent = currentConfig.icon;

  const handleActivityChange = (newActivity: ActivityType) => {
    setActivity(newActivity);
    onActivityChange?.(newActivity);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{currentConfig.emoji}</span>
          Current Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 bg-gradient-soft rounded-2xl">
          <div className="flex items-center justify-center mb-3">
            <IconComponent className="h-8 w-8 text-foreground/80" />
          </div>
          <h3 className="text-xl font-semibold mb-1">{currentConfig.label}</h3>
          <p className="text-muted-foreground">{currentConfig.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(activityConfig).map(([key, config]) => {
            const isActive = key === activity;
            return (
              <Button
                key={key}
                variant={isActive ? config.variant : "outline"}
                size="lg"
                onClick={() => handleActivityChange(key as ActivityType)}
                className={`flex flex-col h-auto p-4 ${isActive ? "scale-105" : ""}`}
              >
                <span className="text-2xl mb-1">{config.emoji}</span>
                <span className="text-sm">{config.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
