import { useState } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "../ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Button } from "../ui/button";
import { Bell, MessagesSquare, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { useUserRole } from "../../hooks/useUserRole";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children, type }) => {
  const [showProfile, setShowProfile] = useState(false);
  const { role, logout } = useUserRole();
  const navigate = useNavigate();
  
  const handleEditProfile = () => {
    setShowProfile(false);
    navigate('/settings');
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="h-screen">
      <SidebarProvider>
        <div className="flex w-full h-full">
          <DashboardSidebar type={type} />
          <SidebarInset>
            <header className="border-b px-4 py-3 flex justify-between items-center relative">
              <div className="flex items-center">
                <SidebarTrigger className="mr-2" />
                <h1 className="text-xl font-semibold capitalize">{type} Dashboard</h1>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MessagesSquare className="h-5 w-5" />
                </Button>
                <Avatar 
                  className="h-8 w-8 cursor-pointer" 
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
              
              {showProfile && (
                <div className="absolute top-full right-4 mt-2 z-50 shadow-lg">
                  <Card className="w-80 p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">User Profile</h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => setShowProfile(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4 my-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">John Doe</h4>
                        <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                        <div className="mt-1">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
                            {role}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button variant="outline" size="sm" className="w-full" onClick={handleEditProfile}>
                        Edit Profile
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-red-500 hover:text-red-600" 
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </header>
            <div className="p-6 overflow-y-auto">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;