import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileText, Download, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Link } from 'react-router-dom';

const FundraisingGuides = () => {
  const guides = [
    {
      id: 1,
      title: 'Getting Started with Crowdfunding',
      description: 'A comprehensive guide for beginners to understand the basics of crowdfunding.',
      category: 'beginner',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      downloadLink: '#'
    },
    {
      id: 2,
      title: 'Building Your Campaign Strategy',
      description: 'Learn how to create a compelling campaign strategy that resonates with potential backers.',
      category: 'beginner',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      downloadLink: '#'
    },
    {
      id: 3,
      title: 'Creating Compelling Campaign Videos',
      description: 'Tips and techniques for producing videos that effectively communicate your project vision.',
      category: 'intermediate',
      image: 'https://images.unsplash.com/photo-1551817958-c5b51e7b4a33?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      downloadLink: '#'
    },
    {
      id: 4,
      title: 'Effective Social Media Promotion',
      description: 'Strategies for leveraging social media platforms to promote your campaign and build community.',
      category: 'intermediate',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      downloadLink: '#'
    },
    {
      id: 5,
      title: 'Advanced Backer Engagement Techniques',
      description: 'Learn how to keep backers engaged throughout your campaign and beyond.',
      category: 'advanced',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      downloadLink: '#'
    },
    {
      id: 6,
      title: 'Post-Campaign Success Strategies',
      description: 'Guidance on fulfilling promises to backers and leveraging campaign success for future growth.',
      category: 'advanced',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      downloadLink: '#'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Fundraising Guides</h1>
            <p className="text-muted-foreground max-w-2xl">
              Resources to help you plan, launch, and manage successful crowdfunding campaigns.
            </p>
          </div>

          <Tabs defaultValue="all" className="mb-12">
            <TabsList className="mb-8">
              <TabsTrigger value="all">All Guides</TabsTrigger>
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {guides.map(guide => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="beginner">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {guides.filter(g => g.category === 'beginner').map(guide => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="intermediate">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {guides.filter(g => g.category === 'intermediate').map(guide => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="advanced">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {guides.filter(g => g.category === 'advanced').map(guide => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="bg-muted/30 rounded-xl p-8 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Need Personalized Guidance?</h3>
            <p className="text-muted-foreground mb-6">
              Our team is available to help you plan and execute your fundraising campaign.
              Schedule a consultation with one of our crowdfunding experts.
            </p>
            <Button asChild>
              <Link to="/support">
                Request Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const GuideCard = ({ guide }) => {
  return (
    <div className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden">
        <img 
          src={guide.image}
          alt={guide.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm font-medium text-primary capitalize">
            {guide.category} Level
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
        <p className="text-muted-foreground mb-4">{guide.description}</p>
        <div className="flex justify-between items-center">
          <Button variant="outline" asChild>
            <a href={guide.downloadLink}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-primary">
            <FileText className="h-4 w-4 mr-1" />
            Read Online
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FundraisingGuides;