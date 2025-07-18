import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Settings, 
  Edit3, 
  Heart,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import childAvatar from "@/assets/child-avatar.png";

const CaregiverDashboard = () => {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState("alex");

  const children = [
    {
      id: "alex",
      name: "Alex Johnson",
      age: 8,
      condition: "Autism Spectrum",
      avatar: childAvatar,
      status: "active",
      lastUpdate: "2 minutes ago",
      moodScore: 8.2,
      activityLevel: "high"
    },
    {
      id: "emma",
      name: "Emma Davis",
      age: 6,
      condition: "ADHD",
      avatar: childAvatar,
      status: "rest",
      lastUpdate: "15 minutes ago",
      moodScore: 7.5,
      activityLevel: "moderate"
    }
  ];

  const logs = [
    {
      id: 1,
      child: "Alex Johnson",
      time: "2:30 PM",
      type: "mood",
      content: "Alex expressed feeling happy after completing puzzle activity",
      aiSuggestion: "Consider introducing more puzzle-based learning activities",
      status: "pending"
    },
    {
      id: 2,
      child: "Emma Davis", 
      time: "1:45 PM",
      type: "behavior",
      content: "Emma showed increased focus during story time",
      aiSuggestion: "Story-based learning appears effective for Emma's attention span",
      status: "reviewed"
    },
    {
      id: 3,
      child: "Alex Johnson",
      time: "12:15 PM",
      type: "activity",
      content: "Completed physical exercise routine with enthusiasm",
      aiSuggestion: "Physical activities boost Alex's mood - maintain current schedule",
      status: "approved"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Caregiver Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Managing care with insights</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-play-green/20 text-play-green">
                2 Active Children
              </Badge>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="logs">Care Logs</TabsTrigger>
            <TabsTrigger value="children">Children</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">2</p>
                      <p className="text-sm text-muted-foreground">Active Children</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-calm-blue" />
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">Today's Logs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-play-green" />
                    <div>
                      <p className="text-2xl font-bold">87%</p>
                      <p className="text-sm text-muted-foreground">Positive Moods</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-8 w-8 text-alert-orange" />
                    <div>
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">Pending Reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logs.slice(0, 3).map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{log.child}</p>
                          <Badge variant="outline" className="text-xs">{log.type}</Badge>
                          <span className="text-sm text-muted-foreground">{log.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Care Logs & AI Insights
                  <Badge variant="secondary">{logs.length} entries today</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="border border-border/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <div>
                            <p className="font-medium">{log.child}</p>
                            <p className="text-sm text-muted-foreground">{log.time}</p>
                          </div>
                          <Badge variant="outline">{log.type}</Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm mb-3">{log.content}</p>
                      
                      <div className="bg-accent/50 rounded-lg p-3 border border-accent/20">
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 bg-gradient-warm rounded flex items-center justify-center text-white text-xs font-bold mt-0.5">
                            AI
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{log.aiSuggestion}</p>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline" className="h-7 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs">
                                <Edit3 className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Children Tab */}
          <TabsContent value="children" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {children.map((child) => (
                <Card key={child.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={child.avatar}
                          alt={child.name}
                          className="w-16 h-16 rounded-full border-2 border-primary/20"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background ${
                          child.status === "active" ? "bg-play-green" : "bg-rest-purple"
                        }`}></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{child.name}</h3>
                        <p className="text-sm text-muted-foreground">Age {child.age} • {child.condition}</p>
                        <p className="text-xs text-muted-foreground">Last update: {child.lastUpdate}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{child.moodScore}</div>
                        <div className="text-xs text-muted-foreground">Mood Score</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${
                          child.activityLevel === "high" ? "text-play-green" : "text-calm-blue"
                        }`}>
                          {child.activityLevel === "high" ? "HIGH" : "MOD"}
                        </div>
                        <div className="text-xs text-muted-foreground">Activity</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Behavior Graph
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        View Daily Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CaregiverDashboard;
