import { Button } from "./ui/button";
import { DollarSign, Users, Briefcase, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { checkAuthAndRedirect } from "../utils/authRedirect";

const stats = [
  {
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    value: "10M+",
    label: "Birr Raised",
    description: "Total contributions from our community"
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    value: "5000+",
    label: "Backers",
    description: "Supporters who believe in our projects"
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    value: "250+",
    label: "Projects Funded",
    description: "Successful campaigns completed"
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    value: "95%",
    label: "Success Rate",
    description: "Projects that meet their funding goals"
  }
];

const Stats = () => {
  const handleStartCampaign = () => {
    if (checkAuthAndRedirect('/login')) {
      window.location.href = '/create-campaign';
    }
  };

  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Impact</h2>
          <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
            Together we're building a brighter future for Wollo University and beyond.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 flex flex-col items-center text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white/20 p-3 rounded-full mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-lg font-semibold mb-2">{stat.label}</p>
              <p className="text-primary-foreground/80 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6">Ready to Make a Difference?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button size="lg" className="bg-white text-primary hover:bg-white/90" onClick={handleStartCampaign}>
                  Start a Campaign
            </Button>
            <Link to="/explore">
              <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white/10">
                Support a Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
