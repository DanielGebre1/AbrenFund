import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, HeartHandshake } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
          <Link to="/" className="inline-flex items-center mb-4">
          <HeartHandshake className="h-6 w-6 text-white mr-2" />
          <span className="text-2xl font-display font-bold text-white">AbrenFund</span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Empowering innovation and impact through community-driven funding.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Learn More</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/how-it-works" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  Success Stories
                </Link>
              </li>
              <li>
              <Link to="/support" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  Support
               
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  Fundraising Guides
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-primary-foreground/70 hover:text-primary-foreground transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Stay Updated</h3>
            <p className="text-primary-foreground/70 mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-l-md rounded-r-none border-r-0 bg-foreground/50 border-foreground/20 text-primary-foreground"
                />
                <Button className="rounded-l-none">
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-primary-foreground/50">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-muted/20 mt-12 pt-6 text-center text-primary-foreground/50 text-sm">
          <p>© {new Date().getFullYear()} AbrenFund. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
