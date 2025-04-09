import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  LayoutDashboard, 
  FilePlus, 
  ClipboardList, 
  Users, 
  MessageSquare, 
  Settings, 
  Plus,
  Edit,
  Trash2, 
  BarChart3, 
  ExternalLink, 
  Calendar, 
  DollarSign,
  Clock,
  ArrowUp,
  ArrowDown,
  Search
} from "lucide-react";
import { Progress } from "../components/ui/progress";
import { Link } from "react-router-dom";

const CreatorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  
  // Sample data - in a real app, this would be fetched from an API
  const myProjects = [
    {
      id: "p1",
      title: "Sustainable Agriculture Initiative",
      category: "Agriculture",
      date: "2023-05-12",
      status: "active",
      goalAmount: 250000,
      raisedAmount: 185000,
      backers: 74,
      daysLeft: 18,
      featured: true
    },
    {
      id: "p2",
      title: "Community Library Expansion",
      category: "Education",
      date: "2023-04-20",
      status: "active",
      goalAmount: 120000,
      raisedAmount: 78500,
      backers: 42,
      daysLeft: 12,
      featured: false
    },
    {
      id: "p3",
      title: "Rural Healthcare Mobile App",
      category: "Healthcare",
      date: "2023-03-15",
      status: "completed",
      goalAmount: 180000,
      raisedAmount: 195000,
      backers: 87,
      daysLeft: 0,
      featured: false
    },
    {
      id: "p4",
      title: "Youth Coding Bootcamp",
      category: "Education",
      date: "2023-02-10",
      status: "draft",
      goalAmount: 150000,
      raisedAmount: 0,
      backers: 0,
      daysLeft: 0,
      featured: false
    }
  ];
  
  const updates = [
    {
      id: "u1",
      projectId: "p1",
      projectTitle: "Sustainable Agriculture Initiative",
      date: "2023-05-18",
      title: "First seeds planted!",
      content: "We've successfully planted the first batch of drought-resistant seeds. Thank you for your support!"
    },
    {
      id: "u2",
      projectId: "p1",
      projectTitle: "Sustainable Agriculture Initiative",
      date: "2023-05-10",
      title: "Land preparation complete",
      content: "The team has finished preparing the demonstration plot and we're ready for planting next week."
    },
    {
      id: "u3",
      projectId: "p2",
      projectTitle: "Community Library Expansion",
      date: "2023-05-05",
      title: "Construction begins next week",
      content: "We've finalized the building permits and construction will begin next Monday!"
    }
  ];
  
  const backers = [
    {
      id: "b1",
      name: "Mekonnen Abebe",
      email: "mekonnen.a@example.com",
      amount: 5000,
      project: "Sustainable Agriculture Initiative",
      date: "2023-05-15"
    },
    {
      id: "b2",
      name: "Selam Haile",
      email: "selam.h@example.com",
      amount: 10000,
      project: "Sustainable Agriculture Initiative",
      date: "2023-05-12"
    },
    {
      id: "b3",
      name: "Dawit Bekele",
      email: "dawit.b@example.com",
      amount: 2500,
      project: "Community Library Expansion",
      date: "2023-05-08"
    },
    {
      id: "b4",
      name: "Hana Tesfaye",
      email: "hana.t@example.com",
      amount: 7500,
      project: "Community Library Expansion",
      date: "2023-05-02"
    }
  ];
  
  const messages = [
    {
      id: "m1",
      from: "Tigist Negash",
      project: "Sustainable Agriculture Initiative",
      date: "2023-05-17",
      message: "I'm interested in volunteering with your project. Can you share more details about how I can help?",
      read: false
    },
    {
      id: "m2",
      from: "Solomon Abate",
      project: "Community Library Expansion",
      date: "2023-05-15",
      message: "Will the library include a children's reading section?",
      read: true
    },
    {
      id: "m3",
      from: "Bethel Tefera",
      project: "Rural Healthcare Mobile App",
      date: "2023-05-10",
      message: "Congratulations on reaching your funding goal! When do you expect to launch the app?",
      read: true
    }
  ];
  
  // Filter projects based on search term
  const filteredProjects = myProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort projects based on sort order
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOrder === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortOrder === "most-funded") {
      return b.raisedAmount - a.raisedAmount;
    } else {
      return a.title.localeCompare(b.title);
    }
  });
  
  // Generate dashboard metrics
  const totalRaised = myProjects.reduce((sum, project) => sum + project.raisedAmount, 0);
  const totalBackers = myProjects.reduce((sum, project) => sum + project.backers, 0);
  const activeProjects = myProjects.filter(p => p.status === "active").length;
  const successRate = Math.round((myProjects.filter(p => p.status === "completed" && p.raisedAmount >= p.goalAmount).length / 
    myProjects.filter(p => p.status === "completed").length) * 100) || 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
              <p className="text-muted-foreground">Manage your projects and backers</p>
            </div>
            
            <div className="mt-4 md:mt-0 md:ml-auto">
              <Button asChild>
                <Link to="/create-project">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Project
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <div className="flex items-center mb-2">
                <DollarSign className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Total Raised</h3>
              </div>
              <p className="text-3xl font-bold">{totalRaised.toLocaleString()} Birr</p>
              <div className="mt-2 text-sm text-muted-foreground">
                Across {myProjects.length} projects
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Total Backers</h3>
              </div>
              <p className="text-3xl font-bold">{totalBackers}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                Supporting your vision
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Active Projects</h3>
              </div>
              <p className="text-3xl font-bold">{activeProjects}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                Currently fundraising
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Success Rate</h3>
              </div>
              <p className="text-3xl font-bold">{successRate}%</p>
              <div className="mt-2">
                <Progress value={successRate} className="h-2" />
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="projects" className="mb-8">
            <div className="border-b mb-6 overflow-x-auto">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="projects" className="px-4">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  My Projects
                </TabsTrigger>
                <TabsTrigger value="updates" className="px-4">
                  <FilePlus className="w-4 h-4 mr-2" />
                  Updates
                </TabsTrigger>
                <TabsTrigger value="backers" className="px-4">
                  <Users className="w-4 h-4 mr-2" />
                  Backers
                </TabsTrigger>
                <TabsTrigger value="messages" className="px-4">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                </TabsTrigger>
                <TabsTrigger value="analytics" className="px-4">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="projects">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 justify-between mb-6">
                  <div className="relative w-full md:w-auto md:flex-grow md:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search projects..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <select 
                      className="border rounded-md px-3 py-2"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="most-funded">Most Funded</option>
                      <option value="alphabetical">Alphabetical</option>
                    </select>
                  </div>
                </div>
                
                {sortedProjects.length > 0 ? (
                  <div className="space-y-4">
                    {sortedProjects.map(project => {
                      const progress = Math.round((project.raisedAmount / project.goalAmount) * 100);
                      
                      return (
                        <div key={project.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                          <div className="flex flex-col lg:flex-row lg:items-center">
                            <div className="flex-grow mb-4 lg:mb-0 lg:mr-4">
                              <div className="flex items-start">
                                <div className="flex-grow">
                                  <div className="flex items-center mb-1">
                                    <span
                                      className={`inline-block h-2 w-2 rounded-full mr-2 ${
                                        project.status === 'active' 
                                          ? 'bg-green-500' 
                                          : project.status === 'completed' 
                                          ? 'bg-blue-500' 
                                          : 'bg-gray-500'
                                      }`}
                                    ></span>
                                    <h3 className="font-bold text-lg">{project.title}</h3>
                                    {project.featured && (
                                      <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                                        Featured
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-3">
                                    <span className="mr-3">{project.category}</span>
                                    <span className="mr-3">Created: {project.date}</span>
                                    <span className="capitalize">
                                      Status: {project.status}
                                    </span>
                                  </div>
                                  
                                  {project.status !== 'draft' && (
                                    <div className="mb-2">
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="font-semibold">{progress}% Funded</span>
                                        <span>{project.raisedAmount.toLocaleString()} of {project.goalAmount.toLocaleString()} Birr</span>
                                      </div>
                                      <Progress value={progress} className="h-2 mb-2" />
                                      <div className="flex text-sm text-muted-foreground">
                                        <span className="mr-4">
                                          <Users className="inline-block h-4 w-4 mr-1" />
                                          {project.backers} backers
                                        </span>
                                        {project.status === 'active' && (
                                          <span>
                                            <Calendar className="inline-block h-4 w-4 mr-1" />
                                            {project.daysLeft} days left
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap lg:flex-nowrap gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/project/${project.id}`}>
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  View
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              {project.status === 'active' && (
                                <Button variant="outline" size="sm">
                                  <FilePlus className="h-4 w-4 mr-1" />
                                  Update
                                </Button>
                              )}
                              {project.status === 'draft' && (
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/10 rounded-lg">
                    <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-bold mb-2">No projects found</h3>
                    <p className="text-muted-foreground mb-4">You don't have any projects yet or none match your search</p>
                    <Button asChild>
                      <Link to="/create-project">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Project
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="updates">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Project Updates</h3>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Update
                  </Button>
                </div>
                
                {updates.length > 0 ? (
                  <div className="space-y-4">
                    {updates.map(update => (
                      <div key={update.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                        <div className="flex items-start">
                          <div className="flex-grow">
                            <div className="text-sm text-muted-foreground mb-1">
                              {update.projectTitle} • {update.date}
                            </div>
                            <h4 className="font-bold text-lg mb-2">{update.title}</h4>
                            <p className="text-muted-foreground mb-3">{update.content}</p>
                            
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/10 rounded-lg">
                    <FilePlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-bold mb-2">No updates yet</h3>
                    <p className="text-muted-foreground mb-4">Keep your backers informed about project progress</p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Update
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="backers">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-xl font-bold mb-6">Project Backers</h3>
                
                {backers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-3 pl-0">Backer</th>
                          <th className="pb-3">Project</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3 pr-0">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {backers.map(backer => (
                          <tr key={backer.id} className="border-b last:border-0 hover:bg-muted/10">
                            <td className="py-4 pl-0">
                              <div className="font-medium">{backer.name}</div>
                              <div className="text-sm text-muted-foreground">{backer.email}</div>
                            </td>
                            <td className="py-4">{backer.project}</td>
                            <td className="py-4 font-medium">{backer.amount.toLocaleString()} Birr</td>
                            <td className="py-4">{backer.date}</td>
                            <td className="py-4 pr-0">
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Message
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/10 rounded-lg">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-bold mb-2">No backers yet</h3>
                    <p className="text-muted-foreground">Share your projects to attract backers</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="messages">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-xl font-bold mb-6">Messages</h3>
                
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`border rounded-lg p-4 hover:border-primary transition-colors ${!message.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-start">
                          <div className="flex-grow">
                            <div className="flex items-center mb-1">
                              <h4 className="font-bold text-lg">{message.from}</h4>
                              {!message.read && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                  New
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mb-3">
                              {message.project} • {message.date}
                            </div>
                            <p className="text-muted-foreground mb-3">{message.message}</p>
                            
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/10 rounded-lg">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-bold mb-2">No messages yet</h3>
                    <p className="text-muted-foreground">Messages from your backers will appear here</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-xl font-bold mb-6">Project Analytics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Funding Progress</h4>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart visualization would go here
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Backer Demographics</h4>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart visualization would go here
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Traffic Sources</h4>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart visualization would go here
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Daily Contributions</h4>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart visualization would go here
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreatorDashboard;