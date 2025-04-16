import { useState } from 'react';
import { Link } from "react-router-dom";
import { Dialog } from "./ui/dialog";
import { Menu, X, HeartHandshake } from "lucide-react";
import { useAuthStore } from "../hooks/useAuthStore";
import DesktopNavigation from "./header/DesktopNavigation";
import MobileMenu from "./header/MobileMenu";
import SearchDialogContent from "./header/SearchDialogContent";
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const { isLoggedIn, logout } = useAuthStore();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    // Optionally redirect to home or login page
    window.location.href = '/';
  };

  const handleSearchClick = () => {
    setSearchDialogOpen(true);
  };

  return (
    <header className="w-full bg-background/90 backdrop-blur-md py-4 sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
        <HeartHandshake className="h-6 w-6 text-primary mr-2" />
        <span className="text-2xl font-display font-bold text-primary">AbrenFund</span>
              </Link>

        {/* Desktop Navigation */}

        <DesktopNavigation 
          isLoggedIn={isLoggedIn} 
          onLogout={handleLogout} 
          onSearchClick={handleSearchClick} 
          />
          

         {/* Mobile Menu Button and Theme Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button 
            className="text-foreground"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isOpen} 
        toggleMenu={toggleMenu} 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout} 
        onSearchClick={handleSearchClick} 
      />
      
       {/* Search Dialog */}
       <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
       <SearchDialogContent onClose={() => setSearchDialogOpen(false)} />

      </Dialog>
    </header>
  );
};

export default Header;


