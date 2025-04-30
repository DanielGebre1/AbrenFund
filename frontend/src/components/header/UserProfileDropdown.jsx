import { Link } from "react-router-dom";
import {
  PanelTop,
  CreditCard,
  Settings,
  LogOut,
  User,
  Bell,
  Shield,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuthStore } from "../../hooks/useAuthStore";

const UserProfileDropdown = ({ onLogout }) => {
  const { user, role } = useAuthStore();

  // Get the first letter of the user's name for the fallback
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user?.avatar || "https://github.com/shadcn.png"} 
              alt={user?.name || "User"} 
            />
            <AvatarFallback>
              {user?.name ? getInitials(user.name) : <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Display user's name and email if available */}
        <DropdownMenuLabel className="flex flex-col">
          {user?.name && <span className="font-semibold">{user.name}</span>}
          {user?.email && <span className="text-xs text-gray-500">{user.email}</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Rest of your menu items remain the same */}
        {role === 'admin' && (
          <Link to="/admin-dashboard">
            <DropdownMenuItem className="cursor-pointer">
              <Shield className="h-4 w-4 mr-2" />
              Admin Dashboard
            </DropdownMenuItem>
          </Link>
        )}

        <Link to="/creator-dashboard">
          <DropdownMenuItem className="cursor-pointer">
            <PanelTop className="h-4 w-4 mr-2" />
            Creator Dashboard
          </DropdownMenuItem>
        </Link>
        <Link to="/wallet">
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="h-4 w-4 mr-2" />
            Wallet
          </DropdownMenuItem>
        </Link>
        <Link to="/notifications">
          <DropdownMenuItem className="cursor-pointer">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </DropdownMenuItem>
        </Link>
        <Link to="/settings">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;