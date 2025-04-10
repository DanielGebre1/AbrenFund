import { useEffect, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Building, Building2, Landmark, LibraryBig, School, Store, BookOpenCheck } from "lucide-react";

const partners = [
  { name: "Wollo University", icon: <School className="h-12 w-12 text-primary" /> },
  { name: "Amhara Development Bank", icon: <Building className="h-12 w-12 text-primary" /> },
  { name: "Ministry of Education", icon: <BookOpenCheck className="h-12 w-12 text-primary" /> },
  { name: "Abren Regional Council", icon: <Landmark className="h-12 w-12 text-primary" /> },
  { name: "Local Business Association", icon: <Store className="h-12 w-12 text-primary" /> },
  { name: "Community Center", icon: <LibraryBig className="h-12 w-12 text-primary" /> },
  { name: "Dessie Town Administration", icon: <Building2 className="h-12 w-12 text-primary" /> },
];

function TrustedPartners() {
  const carouselRef = useRef(null);
  
  useEffect(() => {
    let animationId;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame
    
    const scrollCarousel = () => {
      if (!carouselRef.current) return;
      
      const container = carouselRef.current.querySelector('.embla__container');
      if (!container) return;
      
      scrollPosition += scrollSpeed;
      
      // When we've scrolled through one full item, reset the position
      const firstItem = container.firstElementChild;
      if (firstItem && scrollPosition >= firstItem.offsetWidth) {
        // Clone first item and append to end
        const clone = firstItem.cloneNode(true);
        container.appendChild(clone);
        
        // Remove first item and reset scroll position
        container.removeChild(firstItem);
        scrollPosition = 0;
      }
      
      // Apply the scroll transformation
      container.style.transform = `translateX(-${scrollPosition}px)`;
      
      animationId = requestAnimationFrame(scrollCarousel);
    };
    
    animationId = requestAnimationFrame(scrollCarousel);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold mb-4">Trusted By</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We partner with respected institutions to bring you trustworthy projects
          </p>
        </div>
        <div className="relative overflow-hidden" ref={carouselRef}>
          <Carousel 
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
              containScroll: false,
            }}
            className="w-full"
          >
            <CarouselContent className="py-4">
              {[...partners, ...partners].map((partner, index) => (
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/5 flex justify-center">
                  <div className="flex flex-col items-center p-4 text-center">
                    {partner.icon}
                    <h3 className="mt-3 font-medium">{partner.name}</h3>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

export default TrustedPartners;