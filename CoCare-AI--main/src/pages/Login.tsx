import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Baby, Heart } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"caregiver" | "child" | null>(null);

  const handleRoleSelection = (role: "caregiver" | "child") => {
    setSelectedRole(role);
    setTimeout(() => {
      navigate(role === "caregiver" ? "/caregiver" : "/child");
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">CoCare</h1>
          </div>
          <p className="text-muted-foreground">Supporting every moment together</p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4">
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
              selectedRole === "caregiver" 
                ? "border-primary bg-primary/5 transform scale-105" 
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => handleRoleSelection("caregiver")}
          >
            <CardHeader className="text-center pb-3">
              <div className="mx-auto w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mb-3">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">I'm a Caregiver</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground text-sm">
                Access logs, monitor children, and get AI insights to provide the best care
              </p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
              selectedRole === "child" 
                ? "border-primary bg-primary/5 transform scale-105" 
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => handleRoleSelection("child")}
          >
            <CardHeader className="text-center pb-3">
              <div className="mx-auto w-16 h-16 bg-gradient-calm rounded-full flex items-center justify-center mb-3">
                <Baby className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">I'm a Child</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground text-sm">
                Share your feelings, play games, and customize your avatar
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Switch for Testing */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground text-center mb-3">Quick Switch (Testing)</p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => navigate("/caregiver")}
            >
              Caregiver View
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => navigate("/child")}
            >
              Child View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;