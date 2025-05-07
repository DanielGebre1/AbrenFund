// Mock data generator for projects
export const generateMockProjects = (page, limit) => {
    const projects = [];
    
    // Calculate the starting index based on page and limit
    const startIndex = (page - 1) * limit;
    
    // Generate mock projects
    for (let i = 0; i < limit; i++) {
      const id = startIndex + i + 1;
      const categories = ['Environment', 'Innovation & Tech', 'Education', 'Computer Science'];
      const categoryIndex = id % categories.length;
      
      projects.push({
        id,
        title: `Project ${id}`,
        description: `This is a description for project ${id}. It contains details about the goals and objectives.`,
        imageUrl: `https://source.unsplash.com/300x200?project,${id}`,
        category: categories[categoryIndex],
        raised: Math.floor(Math.random() * 100000),
        goal: 100000,
        daysLeft: Math.floor(Math.random() * 30) + 1,
        backers: Math.floor(Math.random() * 500) + 10
      });
    }
    
    return projects;
  };
  
  // Simulate fetching projects with pagination
  export const fetchProjects = (page, limit) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const projects = generateMockProjects(page, limit);
        resolve({
          projects,
          totalPages: 10 // Simulating 10 pages total
        });
      }, 500); // Simulate network delay
    });
  };