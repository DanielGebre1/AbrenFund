import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CampaignCard from "../components/CampaignCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Slider } from "../components/ui/slider";
import { Check, ChevronDown, Filter, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const campaigns = [
  {
    id: 1,
    title: "Eco-Friendly Irrigation System",
    description:
      "A sustainable irrigation system that uses 60% less water than traditional methods while increasing crop yield by 25%.",
    imageUrl:
      "https://images.unsplash.com/photo-1568198473832-b6b0f46328c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    category: "Agriculture",
    raisedAmount: 76000,
    goalAmount: 125000,
    daysLeft: 14,
    backers: 48,
  },
  {
    id: 2,
    title: "Solar-Powered Learning Centers",
    description:
      "Setting up solar-powered learning centers in rural areas to provide access to digital education resources.",
    imageUrl:
      "https://images.unsplash.com/photo-1522661067900-ab829854a57f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    category: "Education",
    raisedAmount: 45200,
    goalAmount: 60000,
    daysLeft: 21,
    backers: 124,
  },
  {
    id: 3,
    title: "Community Health Monitoring App",
    description:
      "Mobile application for tracking community health metrics and providing early warning for potential outbreaks.",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    category: "Health",
    raisedAmount: 28900,
    goalAmount: 35000,
    daysLeft: 7,
    backers: 89,
  },
  {
    id: 4,
    title: "Affordable 3D-Printed Prosthetics",
    description:
      "Creating low-cost, customizable prosthetic limbs using 3D printing technology to help those in need.",
    imageUrl:
      "https://images.unsplash.com/photo-1551150441-3f3828204ef0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    category: "Technology",
    raisedAmount: 94500,
    goalAmount: 100000,
    daysLeft: 5,
    backers: 216,
  },
  {
    id: 5,
    title: "Traditional Textiles Preservation",
    description:
      "Preserving traditional textile techniques by training new artisans and creating a digital archive of patterns.",
    imageUrl:
      "https://images.unsplash.com/photo-1501677102381-61228a7f1936?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    category: "Culture",
    raisedAmount: 12700,
    goalAmount: 40000,
    daysLeft: 28,
    backers: 53,
  },
  {
    id: 6,
    title: "Clean Water Distribution Network",
    description:
      "Building a sustainable water distribution network for villages that currently lack access to clean water.",
    imageUrl:
      "https://images.unsplash.com/photo-1581094271901-8022df4466f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    category: "Infrastructure",
    raisedAmount: 142000,
    goalAmount: 200000,
    daysLeft: 42,
    backers: 327,
  },
];

const categories = [
  "All Categories",
  "Agriculture",
  "Education",
  "Health",
  "Technology",
  "Culture",
  "Infrastructure",
  "Environment",
  "Arts",
  "Sports",
  "Community",
];

const sortOptions = [
  "Most Popular",
  "Newest",
  "Ending Soon",
  "Most Funded",
  "Least Funded",
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [fundingRange, setFundingRange] = useState([0, 100]);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      campaign.category === selectedCategory;
    const progress = Math.round(
      (campaign.raisedAmount / campaign.goalAmount) * 100
    );
    const matchesFunding =
      progress >= fundingRange[0] && progress <= fundingRange[1];

    return matchesSearch && matchesCategory && matchesFunding;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <section className="bg-gradient-to-b from-primary/10 to-background py-12">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Discover Projects
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Explore innovative projects that are making a difference and
                find causes that inspire you.
              </p>

              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 py-6 pr-4 bg-white shadow-soft rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      {selectedCategory}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      {categories.map((category) => (
                        <DropdownMenuItem
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className="flex items-center justify-between"
                        >
                          {category}
                          {selectedCategory === category && (
                            <Check className="h-4 w-4" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      Sort By: {sortBy}
                      <ChevronDown className="h-4 w-4 ml-2" />
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

              <div className="w-full md:w-72">
                <label className="block text-sm font-medium mb-2">
                  Funding Progress: {fundingRange[0]}% - {fundingRange[1]}%
                </label>
                <Slider
                  defaultValue={[0, 100]}
                  min={0}
                  max={100}
                  step={5}
                  value={fundingRange}
                  onValueChange={setFundingRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">
                  No projects found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <a key={campaign.id} href={`/project/${campaign.id}`}>
                    <CampaignCard {...campaign} />
                  </a>
                ))}
              </div>
            )}

            <div className="mt-10 text-center">
              <Button variant="outline" size="lg">
                Load More Projects
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
