import { Link } from "react-router-dom";
import { 
  Lightbulb, 
  Leaf, 
  Microscope, 
  GraduationCap, 
  Palette, 
  Code, 
  HeartHandshake, 
  Building
} from "lucide-react";

const categories = [
  {
    name: "Innovation & Tech",
    icon: <Lightbulb className="h-6 w-6" />,
    description: "Tech innovations & startups",
    slug: "innovation-tech",
    count: 45
  },
  {
    name: "Environment",
    icon: <Leaf className="h-6 w-6" />,
    description: "Sustainability projects",
    slug: "environment",
    count: 38
  },
  {
    name: "Research",
    icon: <Microscope className="h-6 w-6" />,
    description: "Academic research",
    slug: "research",
    count: 29
  },
  {
    name: "Education",
    icon: <GraduationCap className="h-6 w-6" />,
    description: "Educational initiatives",
    slug: "education",
    count: 56
  },
  {
    name: "Arts & Culture",
    icon: <Palette className="h-6 w-6" />,
    description: "Art & cultural preservation",
    slug: "arts-culture",
    count: 24
  },
  {
    name: "Computer Science",
    icon: <Code className="h-6 w-6" />,
    description: "CS innovations & research",
    slug: "computer-science",
    count: 42
  },
  {
    name: "Community",
    icon: <HeartHandshake className="h-6 w-6" />,
    description: "Community development",
    slug: "community",
    count: 31
  },
  {
    name: "Infrastructure",
    icon: <Building className="h-6 w-6" />,
    description: "Campus infrastructure",
    slug: "infrastructure",
    count: 19
  }
];

function Categories() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold mb-3">Browse Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover projects across various academic and research domains
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={`/explore?category=${category.slug}`}
              className="group bg-muted/30 hover:bg-muted/50 rounded-xl p-4 transition-all duration-300 card-hover"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  {category.icon}
                </div>
                <h3 className="font-medium mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                <span className="text-xs font-medium bg-background px-2 py-1 rounded-full">
                  {category.count} projects
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;