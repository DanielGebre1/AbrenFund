import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedCampaigns from "../components/FeaturedCampaign";
import HowItWorks from "../components/HowItWorks";
import Stats from "../components/Stats";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <FeaturedCampaigns />
        <HowItWorks />
        
        {/* Testimonials/Success Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Success Stories</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                See how our platform has helped turn innovative ideas into reality.
              </p>
            </div>
            
            <div className="bg-muted rounded-2xl p-8 md:p-12 max-w-4xl mx-auto relative">
              <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-0 md:translate-x-1/4">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" 
                    alt="Testimonial author" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="relative">
                <svg className="absolute -top-4 -left-4 h-10 w-10 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                
                <h3 className="text-2xl font-bold mb-4">Renewable Energy Lab Success</h3>
                <p className="text-lg mb-6 text-muted-foreground">
                  "Thanks to the funding we received through WolloFund, we were able to establish a state-of-the-art renewable energy lab that has already produced two patentable innovations. This would not have been possible without the community's support."
                </p>
                
                <div>
                  <p className="font-semibold">Dr. Abeba Tadesse</p>
                  <p className="text-sm text-muted-foreground">Associate Professor, Engineering Department</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <Button variant="link" className="group">
                Read more success stories
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>
        
        <Stats />
        
        {/* Categories Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Project Categories</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Explore projects by category to find initiatives that match your interests.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {["Education", "Technology", "Community", "Health", "Arts", "Environment", "Research", "Agriculture", "Sports", "Infrastructure", "Entrepreneurship", "Culture"].slice(0, 6).map((category, index) => (
                <div 
                  key={category} 
                  className="bg-white rounded-xl shadow-soft p-6 text-center hover:shadow-md transition-all card-hover"
                >
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold">{category.charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold">{category}</h3>
                </div>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Button variant="outline">
                View All Categories
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
