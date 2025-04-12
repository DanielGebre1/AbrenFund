import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { filterSearchData } from "../data/searchData";

export const useSearch = (onClose) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const inputRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setFilteredResults(filterSearchData(query));
    setIsOpen(query.length > 0);
  }, [query]);
  
  const handleSelect = (id) => {
    navigate(`/project/${id}`);
    setQuery("");
    setIsOpen(false);
    if (onClose) onClose();
  };
  
  const handleInputChange = (value) => {
    setQuery(value);
  };
  
  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };
  
  return {
    query,
    isOpen,
    filteredResults,
    inputRef,
    handleSelect,
    handleInputChange,
    clearSearch
  };
};
