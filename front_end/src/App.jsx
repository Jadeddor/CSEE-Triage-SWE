import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import ChatBot from "./pages/ChatBot";
import Admin from "./pages/FacultyDashboard";
import Header from "./pages/Header"; // <-- import header
import { Toaster } from "sonner";

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("faq"); // track which tab is active

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  const isAdmin = user.role === "admin";
  const isChatUser = ["student", "faculty", "guest"].includes(user.role);

  return (
    <div className="App">
      {/* Header shows only when logged in */}
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="p-4">
        {isAdmin && <Admin user={user} />}
        {isChatUser && activeTab === "chat" && <ChatBot user={user} />}
        {/* Other tabs could render FAQ, Dashboard, Support, etc. */}
      </main>

      <Toaster />
    </div>
  );
}

export default App;



// }

// export default App;
