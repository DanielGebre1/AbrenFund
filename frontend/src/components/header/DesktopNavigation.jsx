import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ThemeToggle";
import UserProfileDropdown from "./UserProfileDropdown";

const DesktopNavigation = ({ 
  isLoggedIn, 
  onLogout, 
  onSearchClick 
}) => {
  return (
    <>
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
          onClick={onSearchClick}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        
        {isLoggedIn ? (
          <UserProfileDropdown onLogout={onLogout} />
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