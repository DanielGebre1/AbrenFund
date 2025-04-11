import { Link } from "react-router-dom";
import { PanelTop, CreditCard, Settings, LogOut, User, Bell } from "lucide-react";
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

const UserProfileDropdown = ({ onLogout }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
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