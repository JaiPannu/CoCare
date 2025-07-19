// Update this page (the content is just a fallback if you fail to update the page)
//const Index = () => {
//  return (
//    <div className="min-h-screen flex items-center justify-center bg-background">
//      <div className="text-center">
//        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
 //       <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityStatus } from "@/components/ActivityStatus";
import { ChildSelfExpression } from "@/components/ChildSelfExpression";
import { CaregiverLog } from "@/components/CaregiverLog";
import { Heart, Settings, Camera, Mic } from "lucide-react";
import childAvatar from "@/assets/child-avatar.png";

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const toggleListening = () => {
    setIsListening(!isListening);
    // Here you would integrate with voice detection
  };

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
    // Here you would integrate with pose detection
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={childAvatar}
                  alt="Child avatar"
                  className="w-12 h-12 rounded-full border-2 border-primary/20"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-play-green rounded-full border-2 border-background"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">CoCare</h1>
                <p className="text-sm text-muted-foreground">Supporting every moment</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant={isListening ? "alert" : "outline"}
                size="icon"
                onClick={toggleListening}
                className="relative"
              >
                <Mic className="h-4 w-4" />
                {isListening && (
                  <div className="absolute inset-0 rounded-full bg-alert-orange/20 animate-soft-pulse"></div>
                )}
              </Button>
              
              <Button
                variant={isCameraActive ? "play" : "outline"}
                size="icon"
                onClick={toggleCamera}
                className="relative"
              >
                <Camera className="h-4 w-4" />
                {isCameraActive && (
                  <div className="absolute inset-0 rounded-full bg-play-green/20 animate-soft-pulse"></div>
                )}
              </Button>
              
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Child Profile Card */}
          <Card className="lg:col-span-2 xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5 text-primary" />
                Alex's Day
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="relative mx-auto w-24 h-24">
                <img
                  src={childAvatar}
                  alt="Child profile"
                  className="w-full h-full rounded-full border-4 border-primary/20"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-warm rounded-full flex items-center justify-center text-white text-sm font-bold">
                  😊
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-1">Alex Johnson</h3>
                <p className="text-muted-foreground text-sm">Age 8 • Autism Spectrum</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-play-green">4.2</div>
                  <div className="text-xs text-muted-foreground">Hours Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-calm-blue">12</div>
                  <div className="text-xs text-muted-foreground">Expressions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rest-purple">2.1</div>
                  <div className="text-xs text-muted-foreground">Rest Hours</div>
                </div>
              </div>

              <div className="bg-gradient-soft rounded-2xl p-4">
                <p className="text-sm text-muted-foreground mb-2">Today's Mood</p>
                <div className="flex justify-center gap-2">
                  {["😊", "😌", "🎮", "💤"].map((emoji, index) => (
                    <span
                      key={index}
                      className="text-2xl opacity-70 hover:opacity-100 transition-opacity"
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Status */}
          <div className="lg:col-span-1">
            <ActivityStatus />
          </div>

          {/* Child Self Expression */}
          <div className="lg:col-span-1">
            <ChildSelfExpression />
          </div>

          {/* Caregiver Log */}
          <div className="lg:col-span-2 xl:col-span-3">
            <CaregiverLog />
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-background/90 backdrop-blur-sm rounded-2xl border border-border/50 p-4 shadow-lg">
            <div className="flex gap-3">
              <Button variant="alert" size="lg" className="rounded-2xl">
                🚨 Emergency Guide
              </Button>
              <Button variant="calm" size="lg" className="rounded-2xl">
                🔄 Routine Assistant
              </Button>
              <Button variant="default" size="lg" className="rounded-2xl">
                📊 Daily Report
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
