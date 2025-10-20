import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogIn, GraduationCap, UserCheck } from "lucide-react"
import { Button } from "./features/button"
import { Input } from "./features/input";
import { Card, CardContent, CardHeader, CardTitle } from "./features/ui_features/card"
import { Label } from "./features/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./features/ui_features/select";
import { toast } from "sonner"
//import { GoogleLogin, CredentialResponse, GoogleOAuthProvider } from "@react-oauth/google";

export type UserRole = 'student'| 'guest' | 'faculty' | 'admin';


export interface User{
  email: string;
  role: UserRole;
  name:string;
}

interface LogInProps{
  onLogin: (user:User)=>void;
}


export default function Login({onLogin}: LogInProps){
  const [formData, setValue]=useState({
  email: '',
  role: 'student' as UserRole,
  password:''
  });
  const [isLoggingIn,setLogging]=useState(false);
  
  //handdle form submission and all feilds entered 
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // allows js to handle the form 
    
    if (formData.role !== 'guest' && (!formData.email || !formData.password)) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!formData.email.includes('@umbc.edu')) {
      toast.error("Please use your UMBC email address");
      return;
    }

    setLogging(true);

    setTimeout(() => {
      const userName = formData.email.split('@')[0];
      const displayName = userName.split('.').map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join(' ');

      onLogin({
        email: formData.email || 'guest@umbc.edu',
        role: formData.role,
        name: displayName
      });

      toast.success(`Welcome back, ${displayName}!`);
      setLogging(false);
    }, 1500);
};
  const handleDemoLogin = (role: 'student' | 'faculty' | 'guest', name: string, email: string) => {
    onLogin({ email, role, name });
    toast.success(`Logged in as ${name} (${role})`);
  };
  //return (<div className="p-10 text-lg text-black">✅ Login component rendering</div>);}


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">UMBC CSEE</h1>
          <p className="text-gray-600 mt-2">Help Desk Triage System</p>
        </div>

        { <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role"> I am a:</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: 'student'| 'faculty'| 'guest')=>
                      setValue(prev => ({...prev,role: value}))
                    }
                    >

                    <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty/Staff</SelectItem>
                  </SelectContent>
                </Select>
                </div>
                   
                <div className="space-y-2">
                <Label htmlFor="email">UMBC Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setValue(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@umbc.edu"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setValue(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button
              type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoggingIn}
              >
                
               {isLoggingIn ? (
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                   <div className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </div>
                )} 

                
               </Button>
            
              </form>
              <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 text-center mb-4">Demo Accounts (for testing):</p>
              <div className="space-y-2">
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDemoLogin('student', 'John Smith', 'john.smith@umbc.edu')}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Login as Student
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDemoLogin('faculty', 'Dr. Sarah Johnson', 'sarah.johnson@umbc.edu')}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Login as Faculty
                </Button> */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDemoLogin('guest', 'guest', 'guest@umbc.edu')}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Login as Guest
                </Button>
              </div>
            </div>
            
            </CardContent>
          
        </Card> }

        <div className="text-center text-sm text-gray-600">
          <p>Having trouble signing in?</p>
          <p>Contact IT Help Desk: (410) 455-3838</p>
        </div>
      </div>
    </div>
  );
}
