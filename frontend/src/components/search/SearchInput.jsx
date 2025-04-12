import { useRef } from "react";
import { Search, X } from "lucide-react";

const SearchInput = ({ 
  query, 
  placeholder, 
  onQueryChange, 
  onClear,
  inputRef
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input 
        ref={inputRef}
        type="text" 
        placeholder={placeholder} 
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full pl-10 pr-10 py-3 rounded-md border border-input focus:border-input focus:ring-1 focus:ring-input bg-background"
      />
      {query && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
