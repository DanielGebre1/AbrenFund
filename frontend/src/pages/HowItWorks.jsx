import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { 
  BadgeCheck, 
  Rocket, 
  Heart, 
  Award, 
  ArrowRight, 
  FileCheck, 
  Users, 
  CreditCard, 
  MessageCircle, 
  Bell, 
  Check 
} from "lucide-react";
import { checkAuthAndRedirect } from "../utils/authRedirect";
import { Link } from "react-router-dom";

const HowItWorksPage = () => {
  const handleStartCampaign = () => {
    if (checkAuthAndRedirect('/login')) {
      window.location.href = '/create-campaign';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
         {/* Hero Section with animated background */}
         <section className="bg-gradient-to-b from-primary/10 to-background py-20 relative overflow-hidden">
          {/* Animated background shapes */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute h-96 w-96 rounded-full bg-primary/10 -left-20 -top-20 animate-blob"></div>
            <div className="absolute h-80 w-80 rounded-full bg-secondary/10 right-20 top-40 animate-blob animation-delay-2000"></div>
            <div className="absolute h-72 w-72 rounded-full bg-accent/10 left-1/4 bottom-20 animate-blob animation-delay-4000"></div>
            <div className="absolute h-64 w-64 rounded-full bg-primary/5 right-1/4 bottom-10 animate-blob animation-delay-3000"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
           <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">How AbrenFund Works</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Our platform makes it easy to bring your ideas to life with community support.
              Here's everything you need to know to get started.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
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
        </section>
        
        {/* Process Steps */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">The Funding Process</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From idea to implementation, we've streamlined the process to help you succeed.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
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
              ].map((step, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-soft flex flex-col items-center text-center relative animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-primary/10 p-4 rounded-full mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                  {index < 3 && (
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
          </div>
        </section>
        
        {/* For Campaign Creators */}
        <section className="py-20 bg-muted/50 relative overflow-hidden">
          {/* Animated background shapes */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute h-64 w-64 rounded-full bg-primary/10 -right-10 -top-10 animate-blob animation-delay-1000"></div>
            <div className="absolute h-80 w-80 rounded-full bg-secondary/10 left-10 top-20 animate-blob animation-delay-3000"></div>
            <div className="absolute h-72 w-72 rounded-full bg-accent/10 right-1/3 bottom-10 animate-blob animation-delay-5000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">For Campaign Creators</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need to launch a successful fundraising campaign.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileCheck className="h-8 w-8 text-primary" />,
                  title: "Simple Campaign Creation",
                  description: "Our easy-to-use campaign builder walks you through every step of creating an effective fundraising page."
                },
                {
                  icon: <Users className="h-8 w-8 text-primary" />,
                  title: "Community Support",
                  description: "Get feedback and support from our active community of creators and backers."
                },
                {
                  icon: <CreditCard className="h-8 w-8 text-primary" />,
                  title: "Secure Payments",
                  description: "Funds are securely collected and held until your campaign succeeds."
                },
                {
                  icon: <MessageCircle className="h-8 w-8 text-primary" />,
                  title: "Backer Communication",
                  description: "Built-in tools to keep your supporters updated on your progress."
                },
                {
                  icon: <Bell className="h-8 w-8 text-primary" />,
                  title: "Milestone Notifications",
                  description: "Automatic alerts when you hit funding milestones to help you celebrate progress."
                },
                {
                  icon: <ArrowRight className="h-8 w-8 text-primary" />,
                  title: "Post-Campaign Support",
                  description: "Resources and guidance for implementing your project after successful funding."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-soft hover:shadow-md transition-shadow">
                  <div className="flex items-start mb-4">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* For Backers */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">For Backers</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Support innovations and ideas that matter to you.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-soft">
                <h3 className="text-2xl font-bold mb-6">Why Back a Project?</h3>
                <ul className="space-y-4">
                  {[
                    "Support innovation and creative ideas",
                    "Help bring important projects to life",
                    "Get early access to new products and services",
                    "Become part of a community making a difference",
                    "Follow the journey from concept to completion"
                  ].map((reason, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-soft">
                <h3 className="text-2xl font-bold mb-6">How to Back a Project</h3>
                <ol className="space-y-4">
                  {[
                    "Browse projects or search for specific interests",
                    "Read project details and creator backgrounds",
                    "Choose your contribution amount",
                    "Complete the secure payment process",
                    "Receive updates as the project progresses"
                  ].map((step, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQs */}
        <section className="py-20 bg-muted/50 relative overflow-hidden">
          {/* Animated background shapes for FAQs */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute h-64 w-64 rounded-full bg-primary/10 left-1/4 -top-20 animate-blob animation-delay-2000"></div>
            <div className="absolute h-80 w-80 rounded-full bg-secondary/10 right-1/4 bottom-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Common questions about how AbrenFund works.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {[
                  {
                    question: "What types of projects can be funded on AbrenFund?",
                    answer: "AbrenFund welcomes a wide range of projects including technology, education, agriculture, healthcare, arts, culture, and community initiatives. All projects must comply with our terms of service and community guidelines."
                  },
                  {
                    question: "How do I start a fundraising campaign?",
                    answer: "To start a campaign, create an account, click on 'Start a Campaign', and follow the step-by-step instructions. You'll need to provide details about your project, set a funding goal and timeline, and add compelling visuals."
                  },
                  {
                    question: "What happens if a project doesn't reach its funding goal?",
                    answer: "AbrenFund operates on an all-or-nothing funding model. If a project doesn't reach its funding goal by the deadline, all backers receive a full refund and no funds are transferred to the project creator."
                  },
                  {
                    question: "What fees does AbrenFund charge?",
                    answer: "AbrenFund charges a 5% platform fee on successfully funded projects, plus payment processing fees (typically 3-5% depending on the payment method)."
                  },
                  {
                    question: "How long can my fundraising campaign run?",
                    answer: "Campaigns can run from 1 to 60 days. Our data shows that 30-day campaigns often have the highest success rate, balancing urgency with sufficient time to reach potential backers."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-soft">
                    <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 text-center">
                <p className="mb-4 text-muted-foreground">
                  Didn't find what you're looking for?
                </p>
                <Link to="/support">
                  <Button>
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
          {/* Animated background shapes */}
          <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
            <div className="absolute h-96 w-96 rounded-full bg-white/20 -left-20 -top-20 animate-blob animation-delay-1000"></div>
            <div className="absolute h-80 w-80 rounded-full bg-white/20 right-1/3 top-10 animate-blob animation-delay-3000"></div>
            <div className="absolute h-72 w-72 rounded-full bg-white/20 left-1/3 bottom-10 animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
           <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Bring Your Ideas to Life?
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-10 text-primary-foreground/90">
              Join AbrenFund today and start your journey toward making your project a reality.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
            <Button size="lg" variant="secondary" onClick={handleStartCampaign}>
               Start a Campaign
              </Button>
              <Link to="/explore">
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
