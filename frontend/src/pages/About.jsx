import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { 
  Users, 
  Target, 
  Leaf, 
  Heart, 
  Mail,
  Clock,
  MapPin,
  Phone
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Our Mission</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  At AbrenFund, we're dedicated to connecting innovative ideas with the support they need to thrive.
                  Our platform empowers creators while giving backers the opportunity to participate in bringing impactful projects to life.
                </p>
                <Button size="lg">
                  Join Our Community
                </Button>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-secondary/20 blur-3xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                  alt="Team collaboration" 
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The principles that guide everything we do at AbrenFund.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Leaf className="h-10 w-10 text-primary" />,
                  title: "Sustainability",
                  description: "We believe in supporting projects that contribute to a more sustainable future for our planet and communities."
                },
                {
                  icon: <Users className="h-10 w-10 text-primary" />,
                  title: "Community",
                  description: "We foster a supportive community where creators and backers collaborate to bring ideas to life."
                },
                {
                  icon: <Target className="h-10 w-10 text-primary" />,
                  title: "Innovation",
                  description: "We celebrate creativity and forward-thinking ideas that push boundaries and solve real problems."
                },
                {
                  icon: <Heart className="h-10 w-10 text-primary" />,
                  title: "Transparency",
                  description: "We believe in complete transparency between project creators, backers, and our platform."
                }
              ].map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-soft flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="bg-primary/10 p-4 rounded-full mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground text-lg">
                  The journey that brought AbrenFund to where we are today.
                </p>
              </div>
              
              <div className="space-y-12">
                {/* Story Items - same structure repeated */}
                {/* You can keep them as-is; JSX doesn't need changes here */}
                {/* Only ensure no types are used */}
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The passionate individuals working together to make AbrenFund a reality.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Abebe Bekele",
                  role: "Co-Founder & CEO",
                  photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                },
                {
                  name: "Tigist Haile",
                  role: "Co-Founder & CTO",
                  photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                },
                {
                  name: "Dawit Mengistu",
                  role: "Head of Operations",
                  photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                },
                {
                  name: "Sara Tadesse",
                  role: "Marketing Director",
                  photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                }
              ].map((member, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-md transition-all">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-bold text-xl">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button variant="outline">
                View Full Team
              </Button>
            </div>
          </div>
        </section>
        
        {/* Contact & Location Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Get In Touch</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We'd love to hear from you. Reach out with questions, feedback, or partnership inquiries.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Info Card */}
              {/* Form doesn't need TS syntax either, so it's all JSX-friendly */}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
