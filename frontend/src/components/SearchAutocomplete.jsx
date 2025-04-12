import { useSearch } from "../hooks/useSearch";
import SearchInput from "./search/SearchInput";
import SearchResults from "./search/SearchResults";

const SearchAutocomplete = ({ 
  className = "", 
  placeholder = "Search for projects...",
  onClose,
  isPopover = false
}) => {
  const {
    query,
    isOpen,
    filteredResults,
    inputRef,
    handleSelect,
    handleInputChange,
    clearSearch
  } = useSearch(onClose);

  return (
    <div className={`relative ${className}`}>
      <SearchInput 
        query={query}
        placeholder={placeholder}
        onQueryChange={handleInputChange}
        onClear={clearSearch}
        inputRef={inputRef}
      />
      
      <SearchResults 
        results={filteredResults}
        isOpen={isOpen}
        isPopover={isPopover}
        onSelectItem={handleSelect}
      />
    </div>
  );
};

export default SearchAutocomplete;
