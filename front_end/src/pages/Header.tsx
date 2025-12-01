import { GraduationCap, Search, MessageCircle, Mail, Settings, LogOut, User } from "lucide-react";
import { Button } from "./features/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./features/ui_features/dropdown-menu";

interface User {
  name: string;
  email: string;
  role: "student" | "faculty";
}

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: User | null;
  onLogout?: () => void;
}

export default function Header({ activeTab, setActiveTab, user, onLogout }: HeaderProps) {
  const tabsForFaculty = [
    { id: "dashboard", label: "Dashboard", icon: Settings },
    { id: "faq", label: "FAQ Search", icon: Search },
    { id: "chat", label: "Live Chat", icon: MessageCircle },
    { id: "support", label: "Support Tickets", icon: Mail },
  ];

  const tabsForStudent = [
    { id: "faq", label: "FAQ Search", icon: Search },
    { id: "chat", label: "Live Chat", icon: MessageCircle },
    { id: "support", label: "Support Ticket", icon: Mail },
  ];

  const tabs = user?.role === "faculty" ? tabsForFaculty : tabsForStudent;

  return (
    <header className="bg-secondary text-secondary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop header */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">UMBC CSEE</h1>
              <p className="text-sm opacity-90">Help Desk Triage System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-gray-800 text-gray-300 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-gray-800">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden border-t border-gray-700">
          <div className="flex justify-around py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center py-2 px-3 rounded transition-colors ${
                    activeTab === tab.id ? "text-primary" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{tab.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
