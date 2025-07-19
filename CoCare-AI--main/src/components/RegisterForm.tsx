import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, Baby, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CoCareLogo from "@/components/CoCareLogo";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<"caregiver" | "child" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelection = (role: "caregiver" | "child") => {
    setSelectedRole(role);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "Choose whether you're a caregiver or child",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]");
    
    // Check if email already exists
    const emailExists = existingUsers.some((user: any) => user.email === formData.email);
    
    if (emailExists) {
      toast({
        title: "Email already exists",
        description: "Please use a different email address",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      email: formData.email,
      password: formData.password,
      role: selectedRole,
      name: formData.name
    };

    // Add to existing users and save
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("mockUsers", JSON.stringify(updatedUsers));

    toast({
      title: "Registration successful!",
      description: `Welcome to CoCare, ${formData.name}!`
    });

    // Auto-login the user
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    // Navigate to appropriate dashboard
    navigate(selectedRole === "caregiver" ? "/caregiver" : "/child");

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
          <p className="text-muted-foreground">Join our caring community</p>
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

            <div className="text-center mt-6">
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link to="/" className="text-primary hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        ) : (
          /* Registration Form */
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
                {selectedRole === "caregiver" ? "Caregiver Registration" : "Child Registration"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

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
                      placeholder="Create a password (min 6 characters)"
                      required
                      minLength={6}
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
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <Link to="/" className="text-primary hover:underline">
                    Sign in here
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

export default RegisterForm;