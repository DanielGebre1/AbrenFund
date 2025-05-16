import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Calendar, Users, Award } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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
import api from '../services/api';

// Form schema for proposal submission
const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description must be less than 2000 characters'),
  problem_statement: z.string().min(20, 'Problem statement must be at least 20 characters').max(1000, 'Problem statement must be less than 1000 characters'),
  proposed_solution: z.string().min(20, 'Solution must be at least 20 characters').max(1000, 'Solution must be less than 1000 characters'),
  budget_breakdown: z.string().min(20, 'Budget breakdown must be at least 20 characters').max(1000, 'Budget breakdown must be less than 1000 characters'),
  timeline: z.string().min(5, 'Timeline must be specified'),
  expected_impact: z.string().min(20, 'Expected impact must be at least 20 characters').max(1000, 'Expected impact must be less than 1000 characters'),
  team_info: z.string().min(10, 'Please provide team information'),
});

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      problem_statement: '',
      proposed_solution: '',
      budget_breakdown: '',
      timeline: '',
      expected_impact: '',
      team_info: '',
    },
  });

  // Check if challenge accepts submissions
  const acceptsSubmissions = challenge && 
    (challenge.status === 'active' || challenge.status === 'approved') && 
    challenge.submission_deadline && 
    new Date(challenge.submission_deadline) > new Date();

  // Fetch challenge data and check authentication
  useEffect(() => {
    const fetchChallenge = async () => {
      if (!checkAuthAndRedirect('/login')) {
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/api/campaigns/${id}`);
        
        // Ensure the campaign is a challenge
        if (response.data.data && response.data.data.type !== 'challenge') {
          toast.error('This is not a challenge');
          navigate('/explore');
          return;
        }
        
        setChallenge(response.data.data);
      } catch (error) {
        console.error('Error fetching challenge:', error);
        toast.error('Failed to load challenge details');
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChallenge();
    }
  }, [id, navigate]);

  // Handle image upload for supporting documents
  const handleImageUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      const newFiles = [...files];
      const newImages = [...images];
      
      selectedFiles.forEach((file) => {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast.error(`File ${file.name} is too large (max 5MB)`);
          return;
        }
        
        newFiles.push(file);
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            newImages.push({ url: reader.result.toString(), name: file.name });
            setImages([...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
      
      setFiles(newFiles);
    }
  };

  // Remove an uploaded image
  const removeImage = (index) => {
    const newImages = [...images];
    const newFiles = [...files];
    newImages.splice(index, 1);
    newFiles.splice(index, 1);
    setImages(newImages);
    setFiles(newFiles);
  };

  // Handle form submission
  const onSubmit = async (values) => {
    if (!challenge) return;

    if (!acceptsSubmissions) {
      toast.error('This challenge is not currently accepting submissions');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append all form values
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Append files
      files.forEach((file) => {
        formData.append('supporting_docs[]', file);
      });

      // Submit proposal
      await api.post(`/api/campaigns/${challenge.id}/proposals`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Proposal submitted successfully');
      navigate('/creator-dashboard/proposals');
    } catch (error) {
      console.error('Submission error:', error);
      
      if (error.response?.status === 422) {
        // Handle validation errors
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((field) => {
          form.setError(field, {
            type: 'manual',
            message: errors[field][0],
          });
        });
        toast.error('Please fix the form errors');
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit proposal');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
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

  // Challenge not found state
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
                <Button onClick={() => navigate('/explore')}>View All Challenges</Button>
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
            {/* Challenge Sidebar */}
            <div className="md:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <div className="mb-4 w-16 h-16 rounded-full overflow-hidden mx-auto">
                    <img
                      src={challenge.thumbnail_url || 'https://via.placeholder.com/150'}
                      alt={challenge.company_name || 'Company logo'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-center mb-2">{challenge.title}</h2>
                  <p className="text-center text-muted-foreground mb-6">{challenge.company_name || 'Unknown company'}</p>

                  {/* Submission Status Badge */}
                  <div className="mb-6 text-center">
                    <Badge 
                      variant={acceptsSubmissions ? 'default' : 'destructive'}
                      className="mb-2"
                    >
                      {acceptsSubmissions ? 'Accepting Submissions' : 'Submissions Closed'}
                    </Badge>
                    {challenge.submission_deadline && (
                      <p className="text-xs text-muted-foreground">
                        Deadline: {new Date(challenge.submission_deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm font-medium">Award</p>
                        <p className="text-lg font-bold">${challenge.reward_amount?.toLocaleString() || '0'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm font-medium">Submission Deadline</p>
                        <p>{challenge.submission_deadline ? new Date(challenge.submission_deadline).toLocaleDateString() : 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="text-sm font-medium">Submissions</p>
                        <p>{challenge.proposals_count || 0} proposals</p>
                      </div>
                    </div>
                  </div>

                  {challenge.tags && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-medium mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {challenge.tags.split(',').map((tag, index) => (
                          <Badge key={index} variant="outline">{tag.trim()}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2">
              <Tabs defaultValue="details">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="details" className="flex-1">Challenge Details</TabsTrigger>
                  <TabsTrigger 
                    value="submit" 
                    className="flex-1"
                    disabled={!acceptsSubmissions}
                  >
                    Submit Proposal
                  </TabsTrigger>
                </TabsList>

                {/* Challenge Details Tab */}
                <TabsContent value="details">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Challenge Description</h3>
                      <div className="mb-6 whitespace-pre-line">{challenge.full_description || challenge.short_description || 'No description provided'}</div>

                      <h3 className="text-xl font-bold mb-4">What We're Looking For</h3>
                      <div className="mb-6 whitespace-pre-line">
                        {challenge.project_scope || 'We are seeking innovative solutions that address the challenge outlined above. Your proposal should be well-researched, feasible, and demonstrate a clear understanding of the problem space.'}
                      </div>

                      <h3 className="text-xl font-bold mb-4">Evaluation Criteria</h3>
                      <ul className="list-disc pl-5 space-y-2 mb-6">
                        <li>Innovation and creativity of the solution</li>
                        <li>Technical feasibility and scalability</li>
                        <li>Potential impact and effectiveness</li>
                        <li>Cost-effectiveness and resource efficiency</li>
                        <li>Team qualifications and expertise</li>
                      </ul>

                      <div className="flex justify-center mt-8">
                        <Button
                          size="lg"
                          onClick={() => {
                            const submitTab = document.querySelector('[value="submit"]');
                            if (submitTab) {
                              submitTab.click();
                            }
                          }}
                          disabled={!acceptsSubmissions}
                        >
                          {acceptsSubmissions ? 'Submit Your Proposal' : 'Submissions Closed'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Submit Proposal Tab */}
                <TabsContent value="submit">
                  <Card>
                    <CardContent className="p-6">
                      {acceptsSubmissions ? (
                        <>
                          <h3 className="text-xl font-bold mb-6">Submit Your Proposal</h3>
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                              {/* Proposal Title */}
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

                              {/* Proposal Summary */}
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

                              {/* Problem Statement */}
                              <FormField
                                control={form.control}
                                name="problem_statement"
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

                              {/* Proposed Solution */}
                              <FormField
                                control={form.control}
                                name="proposed_solution"
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

                              {/* Budget Breakdown */}
                              <FormField
                                control={form.control}
                                name="budget_breakdown"
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

                              {/* Project Timeline */}
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

                              {/* Expected Impact */}
                              <FormField
                                control={form.control}
                                name="expected_impact"
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

                              {/* Team Information */}
                              <FormField
                                control={form.control}
                                name="team_info"
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

                              {/* Media Upload */}
                              <MediaUpload
                                images={images}
                                onImageUpload={handleImageUpload}
                                onRemoveImage={removeImage}
                                labelText="Supporting Documents & Images"
                                maxFiles={5}
                              />

                              {/* Submit Button */}
                              <div className="flex justify-end pt-4">
                                <Button size="lg" type="submit" disabled={isSubmitting}>
                                  {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <h3 className="text-xl font-bold mb-4">Submissions Closed</h3>
                          <p className="mb-6">
                            {!challenge.submission_deadline || new Date(challenge.submission_deadline) <= new Date()
                              ? `The submission deadline has passed (${challenge.submission_deadline ? new Date(challenge.submission_deadline).toLocaleDateString() : 'No deadline specified'})`
                              : 'This challenge is not currently accepting submissions'}
                          </p>
                          <Button onClick={() => navigate('/explore')}>
                            Explore Other Challenges
                          </Button>
                        </div>
                      )}
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