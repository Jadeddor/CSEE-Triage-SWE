import { useState } from "react";
import "./App.css";
import LogIn from "./pages/login";
import { Toaster } from "sonner"; // direct import from package


function App(){
  const [activeTab,setActive] = useState("faw");
  const[user,setUser] = useState(null);


    const handleLogin = (userData) => {

    setUser(userData);
    if (userData.role === "faculty") {
      setActiveTab("dashboard");
    } else {
      setActiveTab("faq");
    }
  };

  if (!user) {
    return (
      <>
        <LogIn onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  // Once logged in, show the main content
  return (
    <div className="App">
      
        <h1>Welcome, {user.name}!</h1>
    </div>
  );
}







export default App;

