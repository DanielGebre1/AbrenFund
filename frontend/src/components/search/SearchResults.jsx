import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../ui/command";

const SearchResults = ({ 
  results, 
  isOpen, 
  isPopover, 
  onSelectItem 
}) => {
  if (!isOpen || results.length === 0) return null;

  return (
    <div className={`absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg ${isPopover ? "max-h-[300px] overflow-y-auto" : ""}`}>
      <Command>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Projects">
            {results.map((item) => (
              <CommandItem 
                key={item.id} 
                onSelect={() => onSelectItem(item.id)}
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
  );
};

export default SearchResults;
