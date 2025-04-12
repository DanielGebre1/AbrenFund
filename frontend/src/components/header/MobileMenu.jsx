import { useEffect } from "react";
import { useState } from 'react';
import { Link } from "react-router-dom";
import { Search, PanelTop, CreditCard, Settings, LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeToggle } from "../ThemeToggle";


const MobileMenu = ({ 
  isOpen, 
  toggleMenu, 
  isLoggedIn, 
  onLogout, 
  onSearchClick 
}) => { useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }

  return () => {
    document.body.style.overflow = '';
  };
}, [isOpen]);

if (!isOpen) return null;
  return (
    
<div className="md:hidden bg-background border-t max-h-screen overflow-y-auto">
<div className="container mx-auto px-4 py-4 flex flex-col space-y-4">

        <div className="flex items-center border rounded-md overflow-hidden">
          <button 
            className="p-2"
            onClick={() => {
              onSearchClick();
              toggleMenu();
            }}
          >
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            className="w-full p-2 outline-none bg-transparent"
            onClick={() => {
              onSearchClick();
              toggleMenu();
            }}
            readOnly
            />
        </div>
        <div className="flex justify-end py-2">
         
        </div>
        <Link to="/" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>Home</Link>
        <Link to="/explore" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>Explore</Link>
        <Link to="/how-it-works" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>How It Works</Link>
        <Link to="/about" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>About</Link>
        
        {isLoggedIn ? (
          <div className="flex flex-col space-y-3 pt-3 border-t">
            <div className="flex items-center gap-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium">John Doe</div>
            </div>
            <Link to="/creator-dashboard" onClick={toggleMenu}>
              <Button variant="outline" className="w-full justify-start">
                <PanelTop className="h-4 w-4 mr-2" />
                Creator Dashboard
              </Button>
            </Link>
            <Link to="/wallet" onClick={toggleMenu}>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Wallet
              </Button>
            </Link>
            <Link to="/settings" onClick={toggleMenu}>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button onClick={onLogout} className="w-full justify-start">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-3 pt-3 border-t">
            <Link to="/login"><Button variant="outline">Login</Button></Link>
            <Link to="/signup"><Button>Sign Up</Button></Link>
          </div>
        )}
      </div>
    </div>
        
  );
};

export default MobileMenu;