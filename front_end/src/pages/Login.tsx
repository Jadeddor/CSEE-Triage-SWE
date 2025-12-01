import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogIn, GraduationCap, UserCheck } from "lucide-react"
import { Button } from "./features/button"
import { Input } from "./features/input";
import { Card, CardContent, CardHeader, CardTitle } from "./features/ui_features/card"
import { Label } from "./features/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./features/ui_features/select";
import { toast } from "sonner"

export type UserRole = "student" | "guest" | "faculty" | "admin";

export interface User {
  email: string;
  role: UserRole;
  name: string;
}

interface LogInProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LogInProps) {
  const [formData, setValue] = useState({
    email: "",
    role: "student" as UserRole,
    password: ""
  });

  const [isLoggingIn, setLogging] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation logic
    if (formData.role !== "guest") {
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        return;
      }
      if (!formData.email.includes("@umbc.edu")) {
        toast.error("Please use your UMBC email address");
        return;
      }
    }

    setLogging(true);

    setTimeout(() => {
      const userName = formData.email.split("@")[0];
      const displayName = userName
        .split(".")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");

      onLogin({
        email: formData.role === "guest" ? "guest@umbc.edu" : formData.email,
        role: formData.role,
        name: formData.role === "guest" ? "Guest User" : displayName
      });

      toast.success(`Welcome, ${displayName || "Guest"}!`);
      setLogging(false);
    }, 1200);
  };

  const handleDemoLogin = (role: UserRole, name: string, email: string) => {
    onLogin({ email, role, name });
    toast.success(`Logged in as ${name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">UMBC CSEE</h1>
          <p className="text-gray-600 mt-2">Help Desk Triage System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role */}
              <div className="space-y-2">
                <Label>I am a:</Label>
                <Select
                  value={formData.role}
                  onValueChange={(v: UserRole) =>
                    setValue((prev) => ({ ...prev, role: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty/Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email field */}
              {formData.role !== "guest" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">UMBC Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setValue((prev) => ({ ...prev, email: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setValue((prev) => ({
                          ...prev,
                          password: e.target.value
                        }))
                      }
                    />
                  </div>
                </>
              )}

              <Button className="w-full" type="submit" disabled={isLoggingIn}>
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 text-center mb-4">
                Demo Accounts
              </p>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  handleDemoLogin("guest", "Guest User", "guest@umbc.edu")
                }
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Login as Guest
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
