import { useState } from 'react';
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-md py-4 sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-display font-bold text-primary">WolloFund</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-primary font-medium transition">Home</Link>
          <Link to="/explore" className="text-foreground hover:text-primary font-medium transition">Explore</Link>
          <Link to="/how-it-works" className="text-foreground hover:text-primary font-medium transition">How It Works</Link>
          <Link to="/about" className="text-foreground hover:text-primary font-medium transition">About</Link>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" size="sm" className="rounded-full">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">Login</Button>
          <Button size="sm">Start a Campaign</Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <div className="flex items-center border rounded-md overflow-hidden">
              <Search className="h-4 w-4 ml-3 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search campaigns..." 
                className="w-full p-2 outline-none bg-transparent"
              />
            </div>
            <Link to="/" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>Home</Link>
            <Link to="/explore" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>Explore</Link>
            <Link to="/how-it-works" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>How It Works</Link>
            <Link to="/about" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>About</Link>
            <div className="flex flex-col space-y-3 pt-3 border-t">
              <Button variant="outline">Login</Button>
              <Button>Start a Campaign</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
