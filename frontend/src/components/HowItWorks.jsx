import { BadgeCheck, Rocket, Heart, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { checkAuthAndRedirect } from "../utils/authRedirect";

const steps = [
  {
    icon: <BadgeCheck className="h-10 w-10 text-primary" />,
    title: "Create a Campaign",
    description: "Submit your project details, funding goals, and timeline for approval by our team."
  },
  {
    icon: <Rocket className="h-10 w-10 text-primary" />,
    title: "Launch & Promote",
    description: "Once approved, your campaign goes live. Share with your network to gain support."
  },
  {
    icon: <Heart className="h-10 w-10 text-primary" />,
    title: "Collect Funding",
    description: "Supporters contribute to your campaign using our secure payment system."
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: "Make It Happen",
    description: "With your funding goal reached, implement your project and share updates."
  }
];

const HowItWorks = () => {
  const handleStartCampaign = () => {
    if (checkAuthAndRedirect('/login')) {
      window.location.href = '/creator-dashboard';
    }
  };
  return (
    <section className="py-20 bg-muted/50 relative overflow-hidden">
    {/* Animated background shapes */}
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute h-64 w-64 rounded-full bg-primary/10 -left-10 -top-10 animate-blob"></div>
      <div className="absolute h-80 w-80 rounded-full bg-secondary/10 right-10 top-20 animate-blob animation-delay-2000"></div>
      <div className="absolute h-72 w-72 rounded-full bg-accent/10 left-60 bottom-10 animate-blob animation-delay-4000"></div>
      <div className="absolute h-96 w-96 rounded-full bg-primary/5 -right-20 -bottom-20 animate-blob animation-delay-3000"></div>
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our platform makes it easy to bring your ideas to life with community support.
          </p>
          
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-soft flex flex-col items-center text-center relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="bg-primary/10 p-4 rounded-full mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-1 bg-primary/30"></div>
                </div>
              )}
              
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
            </div>
          ))}
           </div>
        
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleStartCampaign}>
              Start a Campaign
            </Button>
            <Link to="/explore">
              <Button variant="outline" size="lg">
                Browse Projects
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
