import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Calendar, Users, Award } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { getChallengeById } from '../utils/challengeUtils';
import { checkAuthAndRedirect } from '../utils/authRedirect';
import { toast } from 'sonner';
import MediaUpload from '../components/campaign/MediaUpload';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

// Form schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000, "Description must be less than 2000 characters"),
  problem: z.string().min(20, "Problem statement must be at least 20 characters").max(1000, "Problem statement must be less than 1000 characters"),
  solution: z.string().min(20, "Solution must be at least 20 characters").max(1000, "Solution must be less than 1000 characters"),
  budgetBreakdown: z.string().min(20, "Budget breakdown must be at least 20 characters").max(1000, "Budget breakdown must be less than 1000 characters"),
  timeline: z.string().min(5, "Timeline must be specified"),
  impact: z.string().min(20, "Expected impact must be at least 20 characters").max(1000, "Expected impact must be less than 1000 characters"),
  team: z.string().min(10, "Please provide team information"),
});

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      problem: "",
      solution: "",
      budgetBreakdown: "",
      timeline: "",
      impact: "",
      team: "",
    },
  });

  useEffect(() => {
    if (!checkAuthAndRedirect('/login')) {
      return;
    }

    if (id) {
      const fetchedChallenge = getChallengeById(id);
      if (fetchedChallenge) {
        setChallenge(fetchedChallenge);
      } else {
        navigate('/explore?type=challenges');
      }
    }
    setLoading(false);
  }, [id, navigate]);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImages([...images, reader.result.toString()]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = (values) => {
    console.log(values, images);
    toast.success("Proposal submitted successfully");
    navigate('/creator-dashboard/proposals');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12 flex items-center justify-center">
          <Card>
            <CardContent className="py-10 px-6">
              <h2 className="text-2xl font-bold text-center mb-4">Challenge Not Found</h2>
              <p className="text-center mb-6">The challenge you're looking for doesn't exist or has been removed.</p>
              <div className="flex justify-center">
                <Button onClick={() => navigate('/explore?type=challenges')}>
                  View All Challenges
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <div className="mb-4 w-16 h-16 rounded-full overflow-hidden mx-auto">
                    <img 
                      src={challenge.logo || "https://via.placeholder.com/150"} 
                      alt={challenge.company} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-center mb-2">{challenge.title}</h2>
                  <p className="text-center text-muted-foreground mb-6">{challenge.company}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm font-medium">Award</p>
                        <p className="text-lg font-bold">{challenge.award}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm font-medium">Deadline</p>
                        <p>{challenge.deadline}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm font-medium">Submissions</p>
                        <p>{challenge.submissions} proposals</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {challenge.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Tabs defaultValue="details">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="details" className="flex-1">Challenge Details</TabsTrigger>
                  <TabsTrigger value="submit" className="flex-1">Submit Proposal</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Challenge Description</h3>
                      <p className="mb-6">{challenge.description}</p>
                      
                      <h3 className="text-xl font-bold mb-4">What We're Looking For</h3>
                      <p className="mb-6">
                        We are seeking innovative solutions that address the challenge outlined above. 
                        Your proposal should be well-researched, feasible, and demonstrate a clear understanding
                        of the problem space. Successful proposals will include a detailed plan for implementation, 
                        a realistic timeline, and a budget breakdown.
                      </p>
                      
                      <h3 className="text-xl font-bold mb-4">Evaluation Criteria</h3>
                      <ul className="list-disc pl-5 space-y-2 mb-6">
                        <li>Innovation and creativity of the solution</li>
                        <li>Technical feasibility and scalability</li>
                        <li>Potential impact and effectiveness</li>
                        <li>Cost-effectiveness and resource efficiency</li>
                        <li>Team qualifications and expertise</li>
                      </ul>
                      
                      <div className="flex justify-center mt-8">
                        <Button size="lg" onClick={() => document.querySelector('[value="submit"]')?.dispatchEvent(
                          new MouseEvent('click', { bubbles: true })
                        )}>
                          Submit Your Proposal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="submit">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-6">Submit Your Proposal</h3>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Proposal Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter a title for your proposal" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Proposal Summary</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Provide a brief summary of your proposal" 
                                    className="min-h-[100px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="problem"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Problem Statement</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Clearly define the problem you're addressing" 
                                    className="min-h-[100px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="solution"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Proposed Solution</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe your solution in detail" 
                                    className="min-h-[150px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="budgetBreakdown"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Budget Breakdown</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Provide a detailed breakdown of how funds will be used" 
                                    className="min-h-[150px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="timeline"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Project Timeline</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Outline key milestones and project timeline" 
                                    className="min-h-[100px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="impact"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expected Impact</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe the expected outcomes and impact of your project" 
                                    className="min-h-[100px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="team"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Team Information</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe your team members and their qualifications" 
                                    className="min-h-[100px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <MediaUpload
                            images={images}
                            onImageUpload={handleImageUpload}
                            onRemoveImage={removeImage}
                            labelText="Supporting Documents & Images"
                          />
                          
                          <div className="flex justify-end pt-4">
                            <Button size="lg" type="submit">
                              Submit Proposal
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChallengeDetail;