import { useState } from 'react';
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent
} from "./ui/dialog";
import { Link } from "react-router-dom";
import { Menu, X, Search, HeartHandshake, User, Settings, LogOut, CreditCard, PanelTop, Bell } from "lucide-react";
import SearchAutocomplete from "./SearchAutocomplete";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// Mock auth state for demo purposes
// In a real app, this would come from an auth provider
const useAuth = () => {
  // For demo purposes, we'll use localStorage to simulate login state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const login = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
  };

  return { isLoggedIn, login, logout };
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    // Optionally redirect to home or login page
    window.location.href = '/';
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
          {isLoggedIn ? (
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
                <Link to="/payment">
                  <DropdownMenuItem className="cursor-pointer">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payments
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
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login"><Button variant="outline" size="sm">Login</Button></Link>
              <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
            </>
          )} 
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
                <Link to="/payment" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payments
                  </Button>
                </Link>
                <Link to="/settings" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button onClick={handleLogout} className="w-full justify-start">
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
