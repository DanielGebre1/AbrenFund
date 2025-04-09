import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Clock, 
  Users, 
  Share2, 
  Heart, 
  AlertCircle, 
  MessageCircle, 
  Bookmark,
  Info,
  User,
  ArrowRight
} from "lucide-react";

// Sample project data - in a real app, this would come from an API based on the ID
const projects = [
  {
    id: "1",
    title: "Eco-Friendly Irrigation System",
    description: "A sustainable irrigation system that uses 60% less water than traditional methods while increasing crop yield by 25%.",
    fullDescription: "Our innovative irrigation system combines traditional knowledge with modern technology to create a sustainable solution for farmers. The system collects rainwater, filters it, and distributes it to crops as needed based on soil moisture sensors. This reduces water usage by up to 60% compared to conventional irrigation methods.\n\nIn addition to water conservation, our system has been shown to increase crop yields by approximately 25% in field tests. This is achieved through precise water delivery directly to plant roots, reducing evaporation and ensuring plants receive optimal hydration.\n\nThe components are locally manufactured, creating jobs and ensuring parts are readily available for maintenance and repairs. We've designed the system to be modular, allowing farmers to start small and expand as needed.",
    imageUrl: "https://images.unsplash.com/photo-1568198473832-b6b0f46328c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    category: "Agriculture",
    raisedAmount: 76000,
    goalAmount: 125000,
    daysLeft: 14,
    backers: 48,
    createdBy: {
      name: "Green Agricultural Innovations",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      projects: 3,
      bio: "We develop sustainable solutions for agricultural challenges, focusing on water conservation and improving crop yields for small-scale farmers."
    },
    updates: [
      {
        date: "2023-05-15",
        title: "Prototype Testing Completed",
        content: "We've successfully completed testing our latest prototype at five different farms, with excellent results across various crop types. Water conservation rates exceeded our initial estimates, and farmer feedback has been incorporated into our final design."
      },
      {
        date: "2023-04-20",
        title: "Manufacturing Partners Secured",
        content: "We're excited to announce that we've secured partnerships with two local manufacturing companies to produce our system components. This ensures quality control and supports the local economy."
      }
    ],
    faqs: [
      {
        question: "How difficult is the system to install?",
        answer: "The basic system can be installed in one day with basic tools. We provide illustrated instructions and video tutorials, and our team is available for virtual support during installation."
      },
      {
        question: "What maintenance is required?",
        answer: "Monthly cleaning of filters and annual inspection of pumps and sensors is recommended. Most parts have a 5-year warranty and are designed to be easily replaceable if needed."
      },
      {
        question: "Will this work for all types of crops?",
        answer: "The system is configurable for different crop types, from vegetables to fruit trees. We provide specific setup guidelines for common crops in our region."
      }
    ],
    comments: [
      {
        user: "Abebe K.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        date: "2023-05-10",
        content: "I've been following this project from the beginning. The attention to detail and focus on local manufacturing is exactly what our farming community needs."
      },
      {
        user: "Tigist M.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
        date: "2023-05-08",
        content: "Just backed this project! As someone working in agricultural extension, I see huge potential for this to help smallholder farmers in our dryer regions."
      }
    ],
    rewards: [
      {
        amount: 1000,
        title: "Early Supporter",
        description: "Receive project updates and a personalized thank you letter from our team.",
        backers: 15
      },
      {
        amount: 5000,
        title: "Irrigation Kit",
        description: "Get a small-scale version of our irrigation system suitable for home gardens, plus all previous rewards.",
        backers: 22
      },
      {
        amount: 25000,
        title: "Full Farm System",
        description: "Complete irrigation system for a small farm (up to 1 hectare), installation guide, and technical support for one year.",
        backers: 8
      }
    ]
  }
];

const ProjectDetail = () => {
  const { id } = useParams();
  
  // Find the project based on id
  const project = projects.find(p => p.id === id) || projects[0]; // Fallback to first project for demo
  
  const progress = Math.min(Math.round((project.raisedAmount / project.goalAmount) * 100), 100);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Project Header */}
        <section className="py-8 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Project Image */}
              <div className="md:w-7/12">
                <div className="rounded-xl overflow-hidden shadow-soft">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-auto"
                  />
                </div>
              </div>
              
              {/* Project Info */}
              <div className="md:w-5/12">
                <div className="bg-white p-6 rounded-xl shadow-soft h-full flex flex-col">
                  <div className="mb-4">
                    <span className="inline-block bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium mb-3">
                      {project.category}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold mb-3">{project.title}</h1>
                    <p className="text-muted-foreground">{project.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={project.createdBy.avatar} 
                        alt={project.createdBy.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <p className="font-medium">By {project.createdBy.name}</p>
                      <p className="text-sm text-muted-foreground">{project.createdBy.projects} projects</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="mb-5">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold">{progress}% Funded</span>
                        <span>{project.raisedAmount.toLocaleString()} Birr raised</span>
                      </div>
                      <Progress value={progress} className="h-2 mb-1" />
                      <div className="text-right text-sm text-muted-foreground">
                        of {project.goalAmount.toLocaleString()} Birr goal
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-muted/30 p-3 rounded-lg text-center">
                        <div className="flex justify-center items-center mb-1">
                          <Users className="h-5 w-5 text-primary mr-1" />
                          <span className="text-lg font-bold">{project.backers}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Backers</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-lg text-center">
                        <div className="flex justify-center items-center mb-1">
                          <Clock className="h-5 w-5 text-primary mr-1" />
                          <span className="text-lg font-bold">{project.daysLeft}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Days Left</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Button className="w-full">Back This Project</Button>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" className="flex-1">
                          <Heart className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="flex-1">
                          <Bookmark className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="flex-1">
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Project Content */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="lg:w-7/12">
                <Tabs defaultValue="story" className="mb-12">
                  <TabsList className="w-full mb-6">
                    <TabsTrigger value="story" className="flex-1">Story</TabsTrigger>
                    <TabsTrigger value="updates" className="flex-1">Updates ({project.updates.length})</TabsTrigger>
                    <TabsTrigger value="faqs" className="flex-1">FAQs ({project.faqs.length})</TabsTrigger>
                    <TabsTrigger value="comments" className="flex-1">Comments ({project.comments.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="story" className="space-y-8">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line">{project.fullDescription}</p>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                      <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-blue-800">Important Notice</h3>
                        <p className="text-sm text-blue-700">
                          Backing a project comes with some level of risk. Be sure to review the project details and creator background before making a contribution.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="updates" className="space-y-6">
                    {project.updates.map((update, index) => (
                      <div key={index} className="bg-white p-6 rounded-xl shadow-soft">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold">{update.title}</h3>
                          <span className="text-sm text-muted-foreground">{update.date}</span>
                        </div>
                        <p className="text-muted-foreground">{update.content}</p>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="faqs" className="space-y-6">
                    {project.faqs.map((faq, index) => (
                      <div key={index} className="bg-white p-6 rounded-xl shadow-soft">
                        <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                    
                    <div className="bg-muted/30 p-6 rounded-xl">
                      <h3 className="text-lg font-bold mb-2">Have a question?</h3>
                      <p className="text-muted-foreground mb-4">
                        If you couldn't find your answer in the FAQs, feel free to ask the project creator directly.
                      </p>
                      <Button variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Ask a Question
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="comments" className="space-y-6">
                    {project.comments.map((comment, index) => (
                      <div key={index} className="bg-white p-6 rounded-xl shadow-soft">
                        <div className="flex items-start mb-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                            <img 
                              src={comment.avatar} 
                              alt={comment.user}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div>
                            <div className="flex items-baseline">
                              <h3 className="font-bold mr-2">{comment.user}</h3>
                              <span className="text-xs text-muted-foreground">{comment.date}</span>
                            </div>
                            <p className="text-muted-foreground mt-1">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-white p-6 rounded-xl shadow-soft">
                      <h3 className="font-bold mb-4">Leave a Comment</h3>
                      <textarea 
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary mb-4"
                        rows={4}
                        placeholder="Share your thoughts on this project..."
                      ></textarea>
                      <Button>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Post Comment
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Sidebar */}
              <div className="lg:w-5/12">
                {/* Creator Info */}
                <div className="bg-white p-6 rounded-xl shadow-soft mb-6">
                  <h3 className="text-xl font-bold mb-4">About the Creator</h3>
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
                      <img 
                        src={project.createdBy.avatar} 
                        alt={project.createdBy.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h4 className="font-bold">{project.createdBy.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.createdBy.projects} projects created</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{project.createdBy.bio}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
                
                {/* Rewards */}
                <div className="bg-white p-6 rounded-xl shadow-soft mb-6">
                  <h3 className="text-xl font-bold mb-4">Select a Reward</h3>
                  <div className="space-y-4">
                    {project.rewards.map((reward, index) => (
                      <div 
                        key={index} 
                        className="border border-muted p-5 rounded-lg hover:border-primary transition-colors cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold">{reward.title}</h4>
                          <span className="font-semibold text-primary">{reward.amount.toLocaleString()} Birr</span>
                        </div>
                        <p className="text-muted-foreground mb-4">{reward.description}</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            <Users className="inline h-4 w-4 mr-1" />
                            {reward.backers} backers
                          </span>
                          <span className="text-muted-foreground">
                            <Clock className="inline h-4 w-4 mr-1" />
                            {project.daysLeft} days left
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border border-dashed border-muted p-5 rounded-lg hover:border-primary transition-colors cursor-pointer">
                      <h4 className="font-bold mb-2">Custom Pledge</h4>
                      <p className="text-muted-foreground mb-4">
                        Contribute any amount to support this project
                      </p>
                      <div className="flex mb-3">
                        <div className="relative flex-grow">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Birr</span>
                          <input 
                            type="number" 
                            className="w-full pl-12 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Amount"
                          />
                        </div>
                      </div>
                      <Button className="w-full">Continue</Button>
                    </div>
                  </div>
                </div>
                
                {/* Project Risks */}
                <div className="bg-white p-6 rounded-xl shadow-soft">
                  <div className="flex items-start mb-4">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                    <h3 className="text-xl font-bold">Project Risks</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Every project comes with potential risks and challenges. The creator of this project has identified the following risks:
                  </p>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                    <li>Potential delays in manufacturing due to material availability</li>
                    <li>Shipping and logistics challenges in remote areas</li>
                    <li>Weather conditions affecting installation and testing schedules</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Related Projects */}
        <section className="py-10 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Similar Projects</h2>
              <Button variant="link" className="font-medium">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                  <div className="relative">
                    <img 
                      src={`https://source.unsplash.com/random/400x250?agriculture&sig=${index}`}
                      alt="Project thumbnail" 
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Agriculture
                    </span>
                  </div>
                  
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="font-bold text-xl mb-2 line-clamp-2">Sustainable Farming Tool</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      An innovative tool to help small-scale farmers improve efficiency and reduce manual labor.
                    </p>
                    
                    <div className="mt-auto">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold">65% Funded</span>
                        <span>32,500 Birr raised</span>
                      </div>
                      <Progress value={65} className="h-2 mb-4" />
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>18 days left</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          <span>43 backers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectDetail;
