import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  ClipboardList, 
  Users, 
  BarChart3, 
  Settings, 
  Search, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Filter
} from "lucide-react";
import { Progress } from "../components/ui/progress";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Sample data - in a real app, this would be fetched from an API
  const pendingProjects = [
    {
      id: "p1",
      title: "Sustainable Agriculture Initiative",
      organizer: "Green Future Cooperative",
      category: "Agriculture",
      date: "2023-05-12",
      goalAmount: 250000,
      status: "pending"
    },
    
    {
      id: "p3",
      title: "Clean Water Well Project",
      organizer: "Community Development Council",
      category: "Infrastructure",
      date: "2023-05-08",
      goalAmount: 120000,
      status: "pending"
    }
  ];
  
  const activeProjects = [
    {
      id: "a1",
      title: "Solar Power Initiative",
      organizer: "Renewable Energy Cooperative",
      category: "Energy",
      date: "2023-04-25",
      goalAmount: 350000,
      raisedAmount: 215000,
      backers: 87,
      daysLeft: 12,
      status: "active"
    },
   
    {
      id: "a3",
      title: "Women's Tech Training Center",
      organizer: "STEM Education Group",
      category: "Education",
      date: "2023-04-15",
      goalAmount: 200000,
      raisedAmount: 95000,
      backers: 42,
      daysLeft: 8,
      status: "active"
    }
  ];
  
  const users = [
    {
      id: "u1",
      name: "Abebe Kebede",
      email: "abebe.k@example.com",
      role: "Creator",
      projects: 3,
      joinDate: "2023-01-15"
    },
    {
      id: "u2",
      name: "Tigist Haile",
      email: "tigist.h@example.com",
      role: "Backer",
      contributions: 12,
      joinDate: "2023-02-20"
    },
    {
      id: "u3",
      name: "Solomon Tesfaye",
      email: "solomon.t@example.com",
      role: "Creator",
      projects: 1,
      joinDate: "2023-03-05"
    },
    {
      id: "u4",
      name: "Hiwot Tekle",
      email: "hiwot.t@example.com",
      role: "Admin",
      joinDate: "2023-01-10"
    }
  ];
  
  const overviewStats = {
    totalProjects: 48,
    activeProjects: 32,
    completedProjects: 12,
    pendingProjects: 4,
    totalUsers: 1254,
    totalFunds: 2750000,
    monthlyGrowth: 15,
    successRate: 75
  };
  
  // Filter projects based on search term and status
  const filteredPendingProjects = pendingProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === "all" || project.status === filterStatus));
  
  const filteredActiveProjects = activeProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === "all" || project.status === filterStatus));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage projects, users, and platform settings</p>
            </div>
            
            <div className="mt-4 md:mt-0 md:ml-auto">
              <Button>
                Export Reports
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <div className="flex items-center mb-2">
                <ClipboardList className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Total Projects</h3>
              </div>
              <p className="text-3xl font-bold">{overviewStats.totalProjects}</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-600">+{overviewStats.monthlyGrowth}%</span>
                <span className="text-muted-foreground ml-2">from last month</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Total Users</h3>
              </div>
              <p className="text-3xl font-bold">{overviewStats.totalUsers}</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-600">+8%</span>
                <span className="text-muted-foreground ml-2">from last month</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Total Funds Raised</h3>
              </div>
              <p className="text-3xl font-bold">{overviewStats.totalFunds.toLocaleString()} Birr</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-600">+12%</span>
                <span className="text-muted-foreground ml-2">from last month</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold">Success Rate</h3>
              </div>
              <p className="text-3xl font-bold">{overviewStats.successRate}%</p>
              <div className="mt-2">
                <Progress value={overviewStats.successRate} className="h-2" />
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="projects" className="mb-8">
            <TabsList className="mb-6 w-full md:w-auto">
              <TabsTrigger value="projects" className="px-4">
                <ClipboardList className="w-4 h-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="users" className="px-4">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="analytics" className="px-4">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="px-4">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      placeholder="Search projects..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex items-center">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <select 
                      className="border rounded-md px-3 py-2"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                    </select>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4">Pending Approval</h3>
                
                {filteredPendingProjects.length > 0 ? (
                  <div className="overflow-x-auto mb-8">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-3 pl-0">Project</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3">Organizer</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Goal</th>
                          <th className="pb-3 pr-0">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPendingProjects.map(project => (
                          <tr key={project.id} className="border-b last:border-0 hover:bg-muted/10">
                            <td className="py-4 pl-0">
                              <div className="font-medium">{project.title}</div>
                              <div className="text-sm text-muted-foreground">ID: {project.id}</div>
                            </td>
                            <td className="py-4">{project.category}</td>
                            <td className="py-4">{project.organizer}</td>
                            <td className="py-4">{project.date}</td>
                            <td className="py-4">{project.goalAmount.toLocaleString()} Birr</td>
                            <td className="py-4 pr-0">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-muted/10 rounded-md mb-8">
                    <p className="text-muted-foreground">No pending projects found</p>
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-4">Active Projects</h3>
                
                {filteredActiveProjects.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-3 pl-0">Project</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3">Progress</th>
                          <th className="pb-3">Backers</th>
                          <th className="pb-3">Days Left</th>
                          <th className="pb-3 pr-0">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredActiveProjects.map(project => {
                          const progress = Math.round((project.raisedAmount / project.goalAmount) * 100);
                          
                          return (
                            <tr key={project.id} className="border-b last:border-0 hover:bg-muted/10">
                              <td className="py-4 pl-0">
                                <div className="font-medium">{project.title}</div>
                                <div className="text-sm text-muted-foreground">ID: {project.id}</div>
                              </td>
                              <td className="py-4">{project.category}</td>
                              <td className="py-4 w-40">
                                <div className="flex items-center">
                                  <Progress value={progress} className="h-2 mr-2 flex-grow" />
                                  <span className="text-sm font-medium whitespace-nowrap">{progress}%</span>
                                </div>
                              </td>
                              <td className="py-4">{project.backers}</td>
                              <td className="py-4">{project.daysLeft}</td>
                              <td className="py-4 pr-0">
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-muted/10 rounded-md">
                    <p className="text-muted-foreground">No active projects found</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search users..." className="pl-10" />
                  </div>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3 pl-0">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Activity</th>
                        <th className="pb-3">Join Date</th>
                        <th className="pb-3 pr-0">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b last:border-0 hover:bg-muted/10">
                          <td className="py-4 pl-0 font-medium">{user.name}</td>
                          <td className="py-4">{user.email}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'Admin' 
                                ? 'bg-blue-100 text-blue-800' 
                                : user.role === 'Creator'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4">
                            {user.role === 'Creator' ? `${user.projects} projects` : user.role === 'Backer' ? `${user.contributions} contributions` : 'System management'}
                          </td>
                          <td className="py-4">{user.joinDate}</td>
                          <td className="py-4 pr-0">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-xl font-bold mb-6">Platform Analytics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Projects by Category</h4>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart visualization would go here
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Funding Trends</h4>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart visualization would go here
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">User Growth</h4>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart visualization would go here
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Success Rate by Category</h4>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart visualization would go here
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-xl font-bold mb-6">Platform Settings</h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="font-semibold mb-4">General Settings</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Platform Name</label>
                          <Input defaultValue="AbrenFund" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Contact Email</label>
                          <Input defaultValue="support@abrenfund.com" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Platform Description</label>
                        <textarea 
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
                          defaultValue="AbrenFund is a crowdfunding platform dedicated to supporting innovative projects in Ethiopia."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4">Fee Configuration</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Platform Fee (%)</label>
                          <Input type="number" defaultValue="5" min="0" max="20" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Payment Processing Fee (%)</label>
                          <Input type="number" defaultValue="2.5" min="0" max="10" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4">Campaign Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <h5 className="font-medium">Require Approval for Campaigns</h5>
                          <p className="text-sm text-muted-foreground">All campaigns must be approved by an admin before going live</p>
                        </div>
                        <div className="h-6 w-12 bg-primary rounded-full relative cursor-pointer">
                          <div className="h-5 w-5 bg-white rounded-full absolute right-1 top-0.5"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <h5 className="font-medium">Allow Campaign Extensions</h5>
                          <p className="text-sm text-muted-foreground">Project creators can request deadline extensions</p>
                        </div>
                        <div className="h-6 w-12 bg-gray-300 rounded-full relative cursor-pointer">
                          <div className="h-5 w-5 bg-white rounded-full absolute left-1 top-0.5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
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

export default AdminDashboard;