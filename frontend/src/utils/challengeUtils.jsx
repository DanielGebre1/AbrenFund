// Mock data for company challenges
export const challenges = [
    {
      id: 1,
      title: "Sustainable Urban Mobility Solutions",
      company: "GreenCity Technologies",
      logo: "https://i.pravatar.cc/150?img=1",
      description: "Seeking innovative solutions for sustainable urban transportation and reducing carbon emissions in metropolitan areas.",
      award: "$50,000",
      deadline: "July 15, 2023",
      submissions: 12,
      tags: ["Environment", "Innovation & Tech"]
    },
    {
      id: 2,
      title: "Clean Water Access Technologies",
      company: "AquaPure Inc.",
      logo: "https://i.pravatar.cc/150?img=2",
      description: "Looking for scalable technologies that can provide clean water access to underserved communities worldwide.",
      award: "$75,000",
      deadline: "August 1, 2023",
      submissions: 8,
      tags: ["Environment", "Education"]
    },
    {
      id: 3,
      title: "Digital Literacy for Developing Nations",
      company: "EduTech Foundation",
      logo: "https://i.pravatar.cc/150?img=3",
      description: "Projects focused on increasing digital literacy and technology access in developing regions.",
      award: "$40,000",
      deadline: "July 20, 2023",
      submissions: 5,
      tags: ["Education", "Art & Culture"]
    }
  ];
  
  export const getChallengeById = (id) => {
    return challenges.find(challenge => challenge.id === Number(id));
  };