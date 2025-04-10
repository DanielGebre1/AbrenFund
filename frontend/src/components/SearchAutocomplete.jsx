import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "./ui/command";

// Sample search data - in a real app, this would come from API
const searchData = [
  { id: 1, title: "Student Innovation Hub", category: "Innovation & Tech" },
  { id: 2, title: "Environmental Research Project", category: "Environment" },
  { id: 3, title: "STEM Education Initiative", category: "Education" },
  { id: 4, title: "Cultural Heritage Preservation", category: "Arts & Culture" },
  { id: 5, title: "AI Research Lab Equipment", category: "Computer Science" },
  { id: 6, title: "Campus Community Garden", category: "Environment" },
  { id: 7, title: "Digital Library Access Program", category: "Education" },
  { id: 8, title: "Clean Water Research Project", category: "Research" },
  { id: 9, title: "Student Housing Improvement", category: "Infrastructure" },
  { id: 10, title: "Mental Health Awareness Week", category: "Community" },
];

function SearchAutocomplete({ 
  className = "", 
  placeholder = "Search for projects...",
  onClose,
  isPopover = false
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  
  const filteredResults = query === "" 
    ? [] 
    : searchData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.category.toLowerCase().includes(query.toLowerCase())
      );
  
  function handleSelect(id) {
    navigate(`/project/${id}`);
    setQuery("");
    setIsOpen(false);
    if (onClose) onClose();
  }
  
  function handleInputChange(value) {
    setQuery(value);
    if (value.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }
  
  function clearSearch() {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  }
  
  useEffect(() => {
    function handleClickOutside(e) {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          ref={inputRef}
          type="text" 
          placeholder={placeholder} 
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-md border border-input focus:border-input focus:ring-1 focus:ring-input bg-background"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {isOpen && filteredResults.length > 0 && (
        <div className={`absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg ${isPopover ? "max-h-[300px] overflow-y-auto" : ""}`}>
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Projects">
                {filteredResults.map((item) => (
                  <CommandItem 
                    key={item.id} 
                    onSelect={() => handleSelect(item.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        {item.category}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}

export default SearchAutocomplete;