import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const projectTypes = [
  {
    id: 1,
    title: "Research Projects",
    description: "Academic research projects across various disciplines from science to humanities",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
    features: ["Access to research facilities", "Academic mentorship", "Publication support"]
  },
  {
    id: 2,
    title: "Innovation & Tech",
    description: "Technology innovation projects focusing on solving real-world problems",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
    features: ["Prototype development", "Tech incubation", "Industry partnerships"]
  },
  {
    id: 3,
    title: "Community Service",
    description: "Projects aimed at improving local communities and addressing social challenges",
    imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
    features: ["Social impact assessment", "Community partnerships", "Sustainability planning"]
  }
];

const ProjectTypes = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Futured Projects</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the different types of projects that can be funded through our platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {projectTypes.map((type) => (
            <Card key={type.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/20">
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={type.imageUrl} 
                  alt={type.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-xl font-bold text-white p-4">{type.title}</h3>
                </div>
              </div>
              
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">{type.description}</p>
                <ul className="space-y-2">
                  {type.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-0 pb-6 px-6">
                <Link to="/explore" className="text-primary font-medium flex items-center hover:underline">
                  fund projects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectTypes;