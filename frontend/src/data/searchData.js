// Sample search data - in a real app, this would come from API
export const searchData = [
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
  
  export const filterSearchData = (query) => {
    return query === "" 
      ? [] 
      : searchData.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) || 
          item.category.toLowerCase().includes(query.toLowerCase())
        );
  };
  