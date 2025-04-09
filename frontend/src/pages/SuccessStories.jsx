import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Clock, Users, ArrowRight } from "lucide-react";

const successStories = [
  {
    id: 1,
    title: "Renewable Energy Lab Success",
    story: "Thanks to the funding we received through AbrenFund, we were able to establish a state-of-the-art renewable energy lab that has already produced two patentable innovations. This would not have been possible without the community's support.",
    author: {
      name: "Dr. Abeba Tadesse",
      position: "Associate Professor, Engineering Department",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    },
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
    stats: {
      backers: 124,
      funded: "125%",
      days: 45
    },
    category: "Technology"
  },
  {
    id: 2,
    title: "Mobile Health Clinic for Rural Areas",
    story: "Our mobile health clinic now serves 12 rural communities that previously had limited access to healthcare. The funding from AbrenFund allowed us to purchase and equip a vehicle that brings essential medical services to these areas on a regular schedule.",
    author: {
      name: "Dr. Solomon Mekonnen",
      position: "Community Health Director",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    image: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1173&q=80",
    stats: {
      backers: 287,
      funded: "142%",
      days: 60
    },
    category: "Healthcare"
  },
  {
    id: 3,
    title: "Women's Textile Cooperative",
    story: "Our cooperative of 35 women artisans now has a dedicated workspace and modern equipment thanks to AbrenFund backers. We've been able to increase production and secure contracts with international retailers, providing stable income for our members and preserving traditional textile techniques.",
    author: {
      name: "Zewditu Alemu",
      position: "Cooperative Founder",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
    },
    image: "https://images.unsplash.com/photo-1617107648038-458e1c535c08?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
    stats: {
      backers: 156,
      funded: "118%",
      days: 30
    },
    category: "Culture & Art"
  },
  {
    id: 4,
    title: "Educational Tablets for Rural Schools",
    story: "With the funding from AbrenFund, we provided 500 educational tablets preloaded with curriculum materials to students in 5 rural schools. This has significantly improved access to digital learning resources in areas with limited internet connectivity.",
    author: {
      name: "Yonas Gebrehiwot",
      position: "Education Technology Specialist",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
    },
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1122&q=80",
    stats: {
      backers: 342,
      funded: "167%",
      days: 40
    },
    category: "Education"
  },
  {
    id: 5,
    title: "Community Water Purification System",
    story: "Our project implemented a sustainable water purification system that now provides clean drinking water to over 2,000 people. The community-based management approach ensures long-term maintenance and operation of the system.",
    author: {
      name: "Frehiwot Ayele",
      position: "Environmental Engineer",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    image: "https://images.unsplash.com/photo-1543051932-6ef9fecfbc80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    stats: {
      backers: 208,
      funded: "132%",
      days: 55
    },
    category: "Infrastructure"
  },
  {
    id: 6,
    title: "Urban Rooftop Gardens Initiative",
    story: "We've transformed 15 urban rooftops into productive gardens that now grow fresh produce for local communities. These gardens also serve as educational spaces for schools and community groups to learn about sustainable urban agriculture.",
    author: {
      name: "Daniel Hailu",
      position: "Urban Agriculture Specialist",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
    },
    image: "https://images.unsplash.com/photo-1558616629-899031969d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
    stats: {
      backers: 176,
      funded: "112%",
      days: 35
    },
    category: "Agriculture"
  }
];

const SuccessStories = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Success Stories</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover how AbrenFund has helped bring innovative ideas to life and create lasting impact in communities across the region.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10">
              {successStories.map((story, index) => (
                <div key={story.id} className="bg-white rounded-xl overflow-hidden shadow-soft flex flex-col animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative">
                    <img src={story.image} alt={story.title} className="w-full h-64 object-cover" />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
                      {story.category}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h2 className="text-2xl font-bold mb-4">{story.title}</h2>
                    <p className="text-muted-foreground mb-6 flex-grow">"{story.story}"</p>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                        <img src={story.author.avatar} alt={story.author.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold">{story.author.name}</p>
                        <p className="text-sm text-muted-foreground">{story.author.position}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground border-t pt-4">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        <span>{story.stats.backers} backers</span>
                      </div>
                      <div>
                        <span>Funded: {story.stats.funded}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>In {story.stats.days} days</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button>Load More Stories</Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">What Our Community Says</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hear from the people who have experienced the impact of AbrenFund.
            </p>
          </div>
          <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The support we received from the AbrenFund community was incredible...",
                author: "Mihret Tadesse",
                position: "Project Creator"
              },
              {
                quote: "As a backer, I've been able to support causes I care about...",
                author: "Biruk Alemayehu",
                position: "Platform Supporter"
              },
              {
                quote: "AbrenFund helped us scale our initiative from a small local project...",
                author: "Helen Negash",
                position: "Community Leader"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-soft relative">
                <svg className="text-primary/20 h-10 w-10 absolute top-4 left-4" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10,8H6A14,14,0,0,0,6,36h4A14,14,0,0,0,10,8Z" transform="translate(-6 -8)" />
                  <path d="M38,8H34A14,14,0,0,0,34,36h4A14,14,0,0,0,38,8Z" transform="translate(-6 -8)" />
                </svg>
                <div className="pt-8">
                  <p className="mb-6 text-muted-foreground relative z-10">"{testimonial.quote}"</p>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Start Your Own Success Story</h2>
            <p className="text-xl max-w-2xl mx-auto mb-10 text-primary-foreground/90">
              Have a great idea that needs funding? Launch your campaign on AbrenFund today.
            </p>
            <Button size="lg" variant="secondary">
              Start a Campaign <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SuccessStories;
