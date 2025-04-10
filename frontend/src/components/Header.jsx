import { useState } from 'react';
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent
} from "./ui/dialog";
import { Link } from "react-router-dom";
import { Menu, X, Search,Leaf } from "lucide-react";
import SearchAutocomplete from "./SearchAutocomplete";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="w-full bg-background/90 backdrop-blur-md py-4 sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
        <Leaf className="h-6 w-6 text-primary mr-2" />
          <span className="text-2xl font-display font-bold text-primary">AbrenFund</span>
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
        <ThemeToggle />
        <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full"
            onClick={() => setSearchDialogOpen(true)}
          >            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Link to="/login"><Button variant="outline" size="sm">Login</Button></Link>
          <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
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
            <button 
                className="p-2"
                onClick={() => {
                  setSearchDialogOpen(true);
                  setIsOpen(false);
                }}
              >
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>              <input 
                type="text" 
                placeholder="Search campaigns..." 
                className="w-full p-2 outline-none bg-transparent"
                onClick={() => {
                  setSearchDialogOpen(true);
                  setIsOpen(false);
                }}
                readOnly
              />
              </div>
            <div className="flex justify-end py-2">
              <ThemeToggle />
            </div>
            <Link to="/" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>Home</Link>
            <Link to="/explore" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>Explore</Link>
            <Link to="/how-it-works" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>How It Works</Link>
            <Link to="/about" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>About</Link>
            <div className="flex flex-col space-y-3 pt-3 border-t">
            <Link to="/login"><Button variant="outline">Login</Button></Link>
              <Link to="/signup"><Button>Sign Up</Button></Link>
           </div>
          </div>
        </div>
      )}
      
       {/* Search Dialog */}
       <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <DialogContent className="sm:max-w-md p-0">
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Search Projects</h2>
            <SearchAutocomplete 
              placeholder="Search for projects or causes..." 
              onClose={() => setSearchDialogOpen(false)}
              isPopover={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
