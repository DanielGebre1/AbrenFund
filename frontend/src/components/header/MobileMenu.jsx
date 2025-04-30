import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // 🧠 add navigate
import { useAuthStore } from "../../hooks/useAuthStore";
import { Search, PanelTop, CreditCard, Settings, LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const MobileMenu = ({ isOpen, toggleMenu, onSearchClick, user }) => {
 const { logout,isLoggedIn } = useAuthStore();
 const navigate = useNavigate(); // 🧠

 useEffect(() => {
   document.body.style.overflow = isOpen ? 'hidden' : '';
   return () => { document.body.style.overflow = ''; };
 }, [isOpen]);

 if (!isOpen) return null;

 const handleLogout = async () => {
   await logout();  // wait for logout
   toggleMenu();
   navigate('/login'); // redirect after logout ✅
 };

 return (
   <div className="md:hidden bg-background border-t max-h-screen overflow-y-auto">
     <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">

       {/* Search */}
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

       {/* Navigation links */}
       <Link to="/" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>Home</Link>
       <Link to="/explore" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>Explore</Link>
       <Link to="/how-it-works" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>How It Works</Link>
       <Link to="/about" className="py-3 text-foreground hover:text-primary font-medium" onClick={toggleMenu}>About</Link>

       {/* User actions */}
       {isLoggedIn ? (
         <div className="flex flex-col space-y-3 pt-3 border-t">
           <div className="flex items-center gap-3 py-2">
             <Avatar className="h-8 w-8">
               <AvatarImage
                 src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}`}
                 alt="User Avatar"
               />
               <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
             </Avatar>
             <div className="text-sm font-medium">{user?.name || 'User'}</div>
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
           <Button onClick={handleLogout} className="w-full justify-start">
             <LogOut className="h-4 w-4 mr-2" />
             Log out
           </Button>
         </div>
       ) : (
         <div className="flex flex-col space-y-3 pt-3 border-t">
           <Link to="/login" onClick={toggleMenu}><Button variant="outline">Login</Button></Link>
           <Link to="/signup" onClick={toggleMenu}><Button>Sign Up</Button></Link>
         </div>
       )}
     </div>
   </div>
 );
};

export default MobileMenu;
