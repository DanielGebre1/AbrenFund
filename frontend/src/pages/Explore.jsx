import { useState, useRef, useCallback, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CampaignCard from "../components/CampaignCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Slider } from "../components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Check, ChevronDown, Filter, Search, Loader, Calendar, Flame, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import SearchAutocomplete from "../components/SearchAutocomplete";
import { useLocation } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";
import { Checkbox } from "../components/ui/checkbox";

// Sample data
const allCampaigns = [
  {
    id: 1,
    title: "Eco-Friendly Irrigation System",
    description: "A sustainable irrigation system that uses 60% less water than traditional methods while increasing crop yield by 25%.",
    imageUrl: "https://images.unsplash.com/photo-1568198473832-b6b0f46328c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    category: "Environment",
    raisedAmount: 76000,
    goalAmount: 125000,
    daysLeft: 14,
    backers: 48
  },
  {
    id: 2,
    title: "Solar-Powered Learning Centers",
    description: "Setting up solar-powered learning centers in rural areas to provide access to digital education resources.",
    imageUrl: "https://images.unsplash.com/photo-1522661067900-ab829854a57f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    category: "Education",
    raisedAmount: 45200,
    goalAmount: 60000,
    daysLeft: 21,
    backers: 124
  },
  {
    id: 3,
    title: "Community Health Monitoring App",
    description: "Mobile application for tracking community health metrics and providing early warning for potential outbreaks.",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    category: "Health",
    raisedAmount: 28900,
    goalAmount: 35000,
    daysLeft: 7,
    backers: 89
  },

];

const fundingChallenges = [
  {
    id: 1,
    title: "Green Energy Innovation",
    company: "EcoTech Solutions",
    description: "Seeking innovative green energy solutions that can be implemented in urban environments",
    deadline: "2025-06-30",
    reward: "500000",
    imageUrl: "https://images.unsplash.com/photo-1473281305751-8b30f64a3908?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 2,
    title: "Educational Technology Challenge",
    company: "Future Learn",
    description: "Looking for technologies that can improve remote learning experiences for K-12 students",
    deadline: "2025-07-15",
    reward: "350000",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 3,
    title: "Healthcare Access Solutions",
    company: "MediCare Innovations",
    description: "Seeking projects that can provide healthcare access to underserved rural communities",
    deadline: "2025-08-01",
    reward: "750000",
    imageUrl: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
  }

];

const categories = [
  "All Categories", "Innovation & Tech", "Environment", "Education", "Art & Culture", 
  "Health", "Infrastructure", "Sports", "Community"
];

const sortOptions = [
  "Most Popular", "Newest", "Ending Soon", "Most Funded", "Least Funded"
];

const ITEMS_PER_PAGE = 6;

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["All Categories"]);
  const [sortBy, setSortBy] = useState("Most Popular");
  const [fundingRange, setFundingRange] = useState([0, 100]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState("popular");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const observer = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const typeParam = params.get('type');
    
    if (categoryParam) {
      const categoryName = categories.find(c => 
        c.toLowerCase().replace(/\s+/g, '-') === categoryParam
      );
      if (categoryName) {
        setSelectedCategories([categoryName]);
      }
    }
    
    if (typeParam === "challenges") {
      const challengesTab = document.querySelector('[value="challenges"]');
      if (challengesTab) {
        challengesTab.click();
      }
    }
  }, [location]);

  const toggleCategory = (category) => {
    if (category === "All Categories") {
      setSelectedCategories(["All Categories"]);
      return;
    }
    
    if (selectedCategories.includes("All Categories")) {
      setSelectedCategories([category]);
      return;
    }
    
    if (selectedCategories.includes(category)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== category));
      }
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const filteredCampaigns = allCampaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategories.includes("All Categories") || 
                            selectedCategories.some(cat => campaign.category === cat);
    
    const progress = Math.round((campaign.raisedAmount / campaign.goalAmount) * 100);
    const matchesFunding = progress >= fundingRange[0] && progress <= fundingRange[1];
    
    return matchesSearch && matchesCategory && matchesFunding;
  });

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    switch (sortBy) {
      case "Newest":
        return b.id - a.id;
      case "Ending Soon":
        return a.daysLeft - b.daysLeft;
      case "Most Funded":
        return (b.raisedAmount / b.goalAmount) - (a.raisedAmount / a.goalAmount);
      case "Least Funded":
        return (a.raisedAmount / a.goalAmount) - (b.raisedAmount / a.goalAmount);
      default:
        return b.backers - a.backers;
    }
  });

  const paginatedCampaigns = sortedCampaigns.slice(0, page * ITEMS_PER_PAGE);

  const lastCampaignRef = useCallback((node) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && paginatedCampaigns.length < filteredCampaigns.length) {
        loadMore();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, filteredCampaigns.length, paginatedCampaigns.length]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
      setLoading(false);
      setHasMore(page * ITEMS_PER_PAGE < filteredCampaigns.length);
    }, 800);
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [searchQuery, selectedCategories, fundingRange, sortBy]);

  const popularCampaigns = [...sortedCampaigns]
    .sort((a, b) => b.backers - a.backers)
    .slice(0, 8);
  
  const newCampaigns = [...sortedCampaigns]
    .sort((a, b) => b.id - a.id)
    .slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-primary/10 to-background py-12">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Discover Projects</h1>
              <p className="text-muted-foreground text-lg mb-8">
                Explore innovative projects that are making a difference and find causes that inspire you.
              </p>
              
              <div className="relative max-w-2xl mx-auto">
                <SearchAutocomplete 
                  placeholder="Search projects..." 
                  className="w-full"
                  isPopover={true}
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <Tabs defaultValue="projects" className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <TabsList className="bg-background/80 backdrop-blur-sm">
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="challenges">Funding Challenges</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex space-x-2">
                    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Filter className="h-4 w-4 mr-2" />
                          Categories ({selectedCategories.length})
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 p-2">
                        <DropdownMenuGroup>
                          {categories.map((category) => (
                            <div 
                              key={category}
                              className="flex items-center space-x-2 py-1.5 px-2 rounded-md hover:bg-muted cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleCategory(category);
                              }}
                            >
                              <Checkbox 
                                id={`category-${category}`}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => toggleCategory(category)}
                              />
                              <label
                                htmlFor={`category-${category}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                              >
                                {category}
                              </label>
                              {selectedCategories.includes(category) && <Check className="h-4 w-4" />}
                            </div>
                          ))}
                          
                          <div className="mt-2 pt-2 border-t border-muted">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => {
                                setSelectedCategories(["All Categories"]);
                              }}
                            >
                              Reset Filters
                            </Button>
                            <Button 
                              size="sm"
                              className="w-full mt-2"
                              onClick={() => {
                                setIsDropdownOpen(false);
                              }}
                            >
                              Apply Filters
                            </Button>
                          </div>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center">
                          Sort: {sortBy}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                          {sortOptions.map((option) => (
                            <DropdownMenuItem 
                              key={option}
                              onClick={() => setSortBy(option)}
                              className="flex items-center justify-between"
                            >
                              {option}
                              {sortBy === option && <Check className="h-4 w-4" />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <TabsContent value="projects" className="mt-0">
                  {selectedCategories.length > 0 && selectedCategories[0] !== "All Categories" && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedCategories.map(category => (
                        <Badge 
                          key={category} 
                          variant="secondary"
                          className="px-3 py-1 flex items-center gap-1"
                        >
                          {category}
                          <button 
                            onClick={() => toggleCategory(category)} 
                            className="ml-1 rounded-full hover:bg-muted p-0.5"
                          >
                            <span className="sr-only">Remove</span>
                            ×
                          </button>
                        </Badge>
                      ))}
                      {selectedCategories.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedCategories(["All Categories"])}
                          className="h-7 text-xs"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <div className="inline-flex bg-muted p-1 rounded-lg">
                      <button 
                        onClick={() => setActiveTab('popular')}
                        className={`px-4 py-2 rounded-md flex items-center gap-1.5 text-sm font-medium transition-all ${
                          activeTab === 'popular' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                        }`}
                      >
                        <Flame className="h-4 w-4" />
                        Popular
                      </button>
                      <button 
                        onClick={() => setActiveTab('new')}
                        className={`px-4 py-2 rounded-md flex items-center gap-1.5 text-sm font-medium transition-all ${
                          activeTab === 'new' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                        }`}
                      >
                        <Star className="h-4 w-4" />
                        New
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {activeTab === 'popular' ? 
                      popularCampaigns.map((campaign, index) => (
                        <div key={campaign.id} ref={index === popularCampaigns.length - 1 ? lastCampaignRef : null}>
                          <a href={`/project/${campaign.id}`}>
                            <CampaignCard {...campaign} />
                          </a>
                        </div>
                      ))
                      :
                      newCampaigns.map((campaign, index) => (
                        <div key={campaign.id} ref={index === newCampaigns.length - 1 ? lastCampaignRef : null}>
                          <a href={`/project/${campaign.id}`}>
                            <CampaignCard {...campaign} />
                          </a>
                        </div>
                      ))
                    }
                  </div>

                  <div className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-display font-bold">All Projects</h2>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {paginatedCampaigns.map((campaign, index) => {
                        if (paginatedCampaigns.length === index + 1) {
                          return (
                            <div key={campaign.id} ref={lastCampaignRef}>
                              <a href={`/project/${campaign.id}`}>
                                <CampaignCard {...campaign} />
                              </a>
                            </div>
                          );
                        } else {
                          return (
                            <div key={campaign.id}>
                              <a href={`/project/${campaign.id}`}>
                                <CampaignCard {...campaign} />
                              </a>
                            </div>
                          );
                        }
                      })}
                    </div>
                    
                    {loading && (
                      <div className="flex justify-center items-center mt-10">
                        <Loader className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    )}
                    
                    {!hasMore && filteredCampaigns.length > ITEMS_PER_PAGE && (
                      <div className="text-center mt-10">
                        <p className="text-muted-foreground">You've reached the end of the results</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="challenges" className="mt-0">
                  <div className="grid md:grid-cols-3 gap-6">
                    {fundingChallenges.map((challenge) => (
                      <Card key={challenge.id} className="overflow-hidden flex flex-col">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={challenge.imageUrl} 
                            alt={challenge.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="py-5 flex-grow">
                          <div className="flex justify-between items-start mb-3">
                            <Badge className="bg-primary-foreground text-primary border-primary mb-1">
                              {challenge.company}
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {new Date(challenge.deadline).toLocaleDateString()}
                            </div>
                          </div>
                          <h3 className="font-bold text-lg mb-2">
                            {challenge.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            {challenge.description}
                          </p>
                          <div className="mt-auto flex justify-between items-center">
                            <div className="text-primary font-medium">
                              {parseInt(challenge.reward).toLocaleString()} ETB
                            </div>
                            <Link to={`/challenge/${challenge.id}`}>
                              <Button variant="outline">Submit Proposal</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;