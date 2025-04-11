import { DialogContent } from "../ui/dialog";
import SearchAutocomplete from "../SearchAutocomplete";

const SearchDialogContent = ({ onClose }) => {
  return (
    <DialogContent className="sm:max-w-md p-0">
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">Search Projects</h2>
        <SearchAutocomplete 
          placeholder="Search for projects or causes..." 
          onClose={onClose}
          isPopover={true}
        />
      </div>
    </DialogContent>
  );
};

export default SearchDialogContent;