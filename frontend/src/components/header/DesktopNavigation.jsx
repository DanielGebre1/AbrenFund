import React from 'react';
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import UserProfileDropdown from "./UserProfileDropdown";
import { ThemeToggle } from "../ThemeToggle";
import { useAuthStore } from "../../hooks/useAuthStore"; 

const DesktopNavigation = ({ onSearchClick, user }) => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);  // ✅ read from zustand
  const logout = useAuthStore(state => state.logout);          // ✅ also read logout from zustand

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        <Link to="/" className="text-foreground hover:text-primary font-medium transition">Home</Link>
        <Link to="/explore" className="text-foreground hover:text-primary font-medium transition">Explore</Link>
        <Link to="/how-it-works" className="text-foreground hover:text-primary font-medium transition">Help</Link>
        <Link to="/about" className="text-foreground hover:text-primary font-medium transition">About</Link>
      </nav>

      {/* Desktop Action Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={onSearchClick}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        <ThemeToggle />

        {isLoggedIn ? (  // ✅ correctly check zustand value
          <UserProfileDropdown onLogout={logout} user={user}/>
        ) : (
          <>
            <Link to="/login"><Button variant="outline" size="sm">Login</Button></Link>
            <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
          </>
        )}
      </div>
    </>
  );
};

export default DesktopNavigation;
