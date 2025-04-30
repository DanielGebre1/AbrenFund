import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import SearchAutocomplete from "./SearchAutocomplete";
import { useAuthStore } from "../hooks/useAuthStore"; // ✅ import Zustand auth store

const Hero = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore(); // ✅ use the hook, it will be reactive

  const handleStartCampaign = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate('/creator-dashboard');
  };

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Fund <span className="gradient-text">Ideas</span> That <br />
              Shape The Future
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Wollo University's crowdfunding platform connects innovators with backers to bring impactful projects to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="relative overflow-hidden group" onClick={handleStartCampaign}>
                <span className="relative z-10">Start a Campaign</span>
                <span className="absolute inset-0 bg-accent transform transition-transform group-hover:scale-x-100 scale-x-0 origin-left"></span>
              </Button>
              <Link to="/explore">
                <Button variant="outline" size="lg">
                  Explore Projects
                </Button>
              </Link>
            </div>

            <div className="mt-12">
              <SearchAutocomplete 
                placeholder="Search for projects or causes..." 
                className="bg-white rounded-xl shadow-soft"
              />
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-lg animate-fade-in">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" 
                alt="Students collaborating on a project" 
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -right-10 bottom-10 z-20 bg-white rounded-lg p-4 shadow-xl animate-fade-in delay-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold">
                  25
                </div>
                <div>
                  <p className="text-sm font-semibold">University Projects</p>
                  <p className="text-xs text-muted-foreground">Successfully Funded</p>
                </div>
              </div>
            </div>
            <div className="absolute -left-10 top-10 z-20 bg-white rounded-lg p-4 shadow-xl animate-fade-in delay-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  $K
                </div>
                <div>
                  <p className="text-sm font-semibold">5M+ Birr</p>
                  <p className="text-xs text-muted-foreground">Total Funds Raised</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 py-6 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-around items-center gap-8">
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">Trusted By</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">Wollo University</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">Ministry of Education</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">Student Association</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">Alumni Network</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
