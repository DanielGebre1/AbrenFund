import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SuccessStoryPreview = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover how AbrenFund has helped innovators bring their ideas to life and create impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80" 
              alt="Rural Technology Initiative" 
              className="w-full h-64 object-cover"
            />
          </div>
          
          <div>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 inline-block">
              Technology
            </span>
            <h3 className="text-2xl font-bold mb-3">Rural Technology Initiative</h3>
            <p className="text-muted-foreground mb-6">
              A student-led team developed a low-cost solar-powered irrigation system for rural farmers, 
              reducing water usage by 40% and increasing crop yields. The project received 150% of its 
              funding goal and has been implemented in 12 communities across Ethiopia.
            </p>
            <blockquote className="border-l-4 border-primary pl-4 italic mb-6">
              "AbrenFund gave us the opportunity to turn our classroom project into a real solution that's 
              making a difference in farmers' lives. The platform's community didn't just provide funding—they 
              offered mentorship and connections that were invaluable."
            </blockquote>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-muted rounded-full mr-4"></div>
              <div>
                <p className="font-medium">Abebe Kebede</p>
                <p className="text-sm text-muted-foreground">Engineering Student, Class of 2023</p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link to="/success-stories" className="flex items-center">
                View All Success Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoryPreview;