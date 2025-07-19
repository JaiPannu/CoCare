import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, Baby, Heart, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CoCareLogo from "@/components/CoCareLogo";

// Mock database - in a real app, this would be replaced with Supabase
const mockUsers = [
  { id: 1, email: "caregiver@example.com", password: "password123", role: "caregiver", name: "Sarah Johnson" },
  { id: 2, email: "child@example.com", password: "fun123", role: "child", name: "Alex" },
  { id: 3, email: "demo@caregiver.com", password: "demo", role: "caregiver", name: "Demo Caregiver" },
  { id: 4, email: "demo@child.com", password: "demo", role: "child", name: "Demo Child" }
];

const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<"caregiver" | "child" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelection = (role: "caregiver" | "child") => {
    setSelectedRole(role);
    // Pre-fill demo credentials based on role
    if (role === "caregiver") {
      setFormData({ email: "demo@caregiver.com", password: "demo" });
    } else {
      setFormData({ email: "demo@child.com", password: "demo" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "Choose whether you're a caregiver or child",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get all users from localStorage (including registered ones)
    const allUsers = [
      ...mockUsers,
      ...JSON.parse(localStorage.getItem("mockUsers") || "[]")
    ];
    
    // Check credentials against all users
    const user = allUsers.find(
      u => u.email === formData.email && 
           u.password === formData.password && 
           u.role === selectedRole
    );

    if (user) {
      // Store user data in localStorage (in real app, use proper auth)
      localStorage.setItem("currentUser", JSON.stringify(user));
      
      toast({
        title: "Login successful!",
        description: `Welcome back, ${user.name}!`
      });

      // Navigate to appropriate dashboard
      navigate(selectedRole === "caregiver" ? "/caregiver" : "/child");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email, password, or role",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <CoCareLogo size="xl" />
          </div>
          <p className="text-muted-foreground">Supporting every moment together</p>
        </div>

        {!selectedRole ? (
          /* Role Selection */
          <div className="space-y-4">
            <Card 
              className="cursor-pointer transition-all duration-300 hover:shadow-lg border-2 border-border hover:border-primary/50"
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
              className="cursor-pointer transition-all duration-300 hover:shadow-lg border-2 border-border hover:border-primary/50"
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
        ) : (
          /* Login Form */
          <Card>
            <CardHeader className="text-center">
              <div className={`mx-auto w-16 h-16 ${selectedRole === "caregiver" ? "bg-gradient-warm" : "bg-gradient-calm"} rounded-full flex items-center justify-center mb-3`}>
                {selectedRole === "caregiver" ? (
                  <UserCheck className="h-8 w-8 text-white" />
                ) : (
                  <Baby className="h-8 w-8 text-white" />
                )}
              </div>
              <CardTitle className="text-xl">
                {selectedRole === "caregiver" ? "Caregiver Login" : "Child Login"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground text-center mb-2">Demo Credentials:</p>
                <p className="text-xs text-muted-foreground text-center">
                  Email: demo@{selectedRole}.com | Password: demo
                </p>
              </div>

              <div className="text-center mt-4">
                <p className="text-muted-foreground text-sm">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Register here
                  </Link>
                </p>
              </div>

              <Button 
                variant="ghost" 
                className="w-full mt-4" 
                onClick={() => setSelectedRole(null)}
              >
                ← Back to role selection
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LoginForm;