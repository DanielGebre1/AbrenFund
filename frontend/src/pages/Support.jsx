import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../components/ui/card';
import { 
  LifeBuoy, 
  MessageSquare, 
  Mail, 
  Phone, 
  FileQuestion, 
  BookOpen, 
  CheckCircle2, 
  Globe, 
  Youtube, 
  Users,
  Rocket
} from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { useToast } from '../hooks/use-toast';

const supportFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  topic: z.enum(["general", "technical", "billing", "campaign", "feature"]),
  message: z.string().min(10, {
    message: "Your message must be at least 10 characters."
  })
});

const faqs = [
  {
    question: "How do I start a fundraising campaign?",
    answer: "To start a campaign, create an account, click on 'Start a Campaign', and follow the step-by-step instructions. You'll need to provide details about your project, set a funding goal and timeline, and add compelling visuals."
  },
  {
    question: "What fees does AbrenFund charge?",
    answer: "AbrenFund charges a 5% platform fee on successfully funded projects, plus payment processing fees (typically 3-5% depending on the payment method)."
  },
  {
    question: "What happens if a project doesn't reach its funding goal?",
    answer: "AbrenFund operates on an all-or-nothing funding model. If a project doesn't reach its funding goal by the deadline, all backers receive a full refund and no funds are transferred to the project creator."
  },
  {
    question: "How long can my fundraising campaign run?",
    answer: "Campaigns can run from 1 to 60 days. Our data shows that 30-day campaigns often have the highest success rate, balancing urgency with sufficient time to reach potential backers."
  },
  {
    question: "How do I withdraw funds after my campaign succeeds?",
    answer: "Once your campaign is successfully funded, you can withdraw funds to your linked bank account from your dashboard. Funds are typically available 7-14 days after the campaign ends, after verification."
  },
  {
    question: "Can I edit my campaign after it launches?",
    answer: "You can make minor edits to your campaign description and add updates after launch. However, you cannot change your funding goal, campaign duration, or remove/modify reward tiers that backers have already selected."
  },
  {
    question: "How do I update my backers on my progress?",
    answer: "You can post updates directly from your campaign dashboard. These updates will be visible on your campaign page and sent to your backers via email, keeping them informed about your progress."
  },
  {
    question: "What types of projects are not allowed on AbrenFund?",
    answer: "AbrenFund prohibits campaigns related to illegal activities, hate speech, personal medical expenses, weapons, and multi-level marketing schemes. Please review our full terms of service for complete guidelines."
  }
];

const Support = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: "",
      email: "",
      topic: "general",
      message: ""
    }
  });

  function onSubmit(data) {
    console.log(data);
    toast({
      title: "Support request submitted",
      description: "We've received your message and will respond within 24-48 hours.",
    });
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-20">
          <div className="container mx-auto px-4 text-center">
            <LifeBuoy className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">How Can We Help?</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Get support for your AbrenFund questions, technical issues, or campaign needs
            </p>
          </div>
        </section>
        
        {/* Support Options */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="pb-3">
                  <MessageSquare className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Get in touch with our customer support team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>support@abrenfund.com</span>
                    </li>
                    <li className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>+251 78 123 4567</span>
                    </li>
                    <li className="text-muted-foreground text-xs mt-4">
                      Response Time: Within 24-48 hours
                    </li>
                  </ul>
                  <Button className="w-full mt-4" variant="outline">
                    Contact Team
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <FileQuestion className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Knowledge Base</CardTitle>
                  <CardDescription>
                    Find answers to common questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <BookOpen className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <span>Campaign creation guides</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <span>Troubleshooting common issues</span>
                    </li>
                    <li className="flex items-start">
                      <Rocket className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <span>Tips for successful fundraising</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-4" variant="outline">
                    Browse Articles
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <Globe className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Community</CardTitle>
                  <CardDescription>
                    Connect with other creators and backers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <span>Discussion forums</span>
                    </li>
                    <li className="flex items-start">
                      <Youtube className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <span>Tutorial videos</span>
                    </li>
                    <li className="flex items-start">
                      <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <span>Creator community events</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-4" variant="outline">
                    Join Community
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Quick answers to common questions about using AbrenFund
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 pt-1">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="mt-10 text-center">
                <p className="text-muted-foreground mb-4">
                  Still have questions?
                </p>
                <Button 
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Form */}
        <section id="contact-form" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. We've received your message and will get back to you within 24-48 hours.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-2 md:grid-cols-5 gap-4"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="general" />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">General</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="technical" />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">Technical</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="billing" />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">Billing</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="campaign" />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">Campaign</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="feature" />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">Feature Request</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please describe your question or issue in detail"
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Please provide as much detail as possible so we can best assist you.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Submit
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Support;