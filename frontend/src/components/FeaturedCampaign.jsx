import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import CampaignCard from "./CampaignCard";
import { Link } from "react-router-dom";

const featuredCampaigns = [
  {
    id: 1,
    title: "Renewable Energy Lab for Engineering Students",
    description: "Help fund cutting-edge equipment for engineering students to research and develop sustainable energy solutions.",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    category: "Education",
    raisedAmount: 275000,
    goalAmount: 450000,
    daysLeft: 15,
    backers: 42,
  },
  {
    id: 2,
    title: "Student Mental Health Support Initiative",
    description: "Creating resources and spaces to support student mental health and wellbeing across campus.",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    category: "Health",
    raisedAmount: 120000,
    goalAmount: 200000,
    daysLeft: 21,
    backers: 78,
  },
  {
    id: 3,
    title: "Agricultural Innovation Hub",
    description: "Supporting local farmers with technology and research to improve crop yields sustainably.",
    imageUrl: "https://images.unsplash.com/photo-1594396436797-fa0957dfd541?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    category: "Agriculture",
    raisedAmount: 350000,
    goalAmount: 500000,
    daysLeft: 30,
    backers: 65,
  },
  {
    id: 4,
    title: "Women in STEM Scholarship Fund",
    description: "Help create scholarships for women pursuing careers in science, technology, engineering, and mathematics.",
    imageUrl: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    category: "Scholarship",
    raisedAmount: 180000,
    goalAmount: 300000,
    daysLeft: 45,
    backers: 93,
  },
  {
    id: 9,
    title: "Educational Robotics Lab",
    description: "Creating a robotics lab for students to learn programming and engineering principles hands-on.",
    imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
    category: "Technology",
    raisedAmount: 195000,
    goalAmount: 350000,
    daysLeft: 25,
    backers: 58,
  },
  {
    id: 10,
    title: "Community Garden Initiative",
    description: "Building sustainable community gardens to teach agriculture and provide fresh produce.",
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
    category: "Agriculture",
    raisedAmount: 87000,
    goalAmount: 120000,
    daysLeft: 18,
    backers: 39,
  },
  {
    id: 11,
    title: "Sports Equipment for Local Schools",
    description: "Providing quality sports equipment to underfunded schools in the region.",
    imageUrl: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
    category: "Sports",
    raisedAmount: 45000,
    goalAmount: 80000,
    daysLeft: 12,
    backers: 32,
  },
  {
    id: 12,
    title: "Digital Literacy Program",
    description: "Teaching essential digital skills to communities with limited technology access.",
    imageUrl: "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
    category: "Education",
    raisedAmount: 110000,
    goalAmount: 180000,
    daysLeft: 28,
    backers: 64,
  },
];

const trendingCampaigns = [
  {
    id: 5,
    title: "Student Entrepreneurship Incubator",
    description: "Creating a space where student entrepreneurs can develop their business ideas with mentorship and resources.",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    category: "Business",
    raisedAmount: 420000,
    goalAmount: 600000,
    daysLeft: 18,
    backers: 105,
  },
  {
    id: 6,
    title: "Digital Library Access Initiative",
    description: "Expanding digital library resources to ensure all students have access to learning materials.",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    category: "Education",
    raisedAmount: 90000,
    goalAmount: 150000,
    daysLeft: 12,
    backers: 34,
  },
  {
    id: 7,
    title: "Clean Water Project for Local Communities",
    description: "Developing sustainable water solutions for communities surrounding the university campus.",
    imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    category: "Community",
    raisedAmount: 280000,
    goalAmount: 400000,
    daysLeft: 25,
    backers: 71,
  },
  {
    id: 8,
    title: "Cultural Heritage Documentation Project",
    description: "Preserving local cultural heritage through digital documentation and community engagement.",
    imageUrl: "https://images.unsplash.com/photo-1511233002817-99325d7cc2d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
    category: "Culture",
    raisedAmount: 75000,
    goalAmount: 200000,
    daysLeft: 38,
    backers: 27,
  },
  {
    id: 13,
    title: "Art Therapy Workshop Series",
    description: "Providing healing through art for students dealing with stress and anxiety.",
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
    category: "Arts",
    raisedAmount: 65000,
    goalAmount: 95000,
    daysLeft: 15,
    backers: 48,
  },
  {
    id: 14,
    title: "Science Lab Equipment Upgrade",
    description: "Modernizing laboratories with state-of-the-art equipment for advanced research.",
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
    category: "Education",
    raisedAmount: 320000,
    goalAmount: 450000,
    daysLeft: 32,
    backers: 79,
  },
  {
    id: 15,
    title: "Accessible Campus Initiative",
    description: "Making university facilities more accessible for students with disabilities.",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
    category: "Accessibility",
    raisedAmount: 170000,
    goalAmount: 250000,
    daysLeft: 22,
    backers: 103,
  },
  {
    id: 16,
    title: "Student Film Festival",
    description: "Funding a platform for student filmmakers to showcase their creative work.",
    imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
    category: "Arts",
    raisedAmount: 55000,
    goalAmount: 100000,
    daysLeft: 19,
    backers: 37,
  },
];

const FeaturedCampaigns = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Discover Projects</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore innovative projects from the Wollo University community that need your support to make a difference.
          </p>
        </div>

        <Tabs defaultValue="featured" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="new">Newest</TabsTrigger>
              <TabsTrigger value="closing">Closing Soon</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="featured">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCampaigns.slice(0, 8).map((campaign) => (
                <CampaignCard key={campaign.id} {...campaign} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingCampaigns.slice(0, 8).map((campaign) => (
                <CampaignCard key={campaign.id} {...campaign} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
{/* For simplicity, using featuredCampaigns but with different sorting */}
{[...featuredCampaigns].reverse().slice(0, 8).map((campaign) => (
                               <CampaignCard key={campaign.id} {...campaign} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="closing">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
{/* For simplicity, using trendingCampaigns but with custom sorting */}
{[...trendingCampaigns].sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 8).map((campaign) => (
                               <CampaignCard key={campaign.id} {...campaign} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
        <Link to="/explore">
            <Button size="lg" variant="outline">
              View All Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
