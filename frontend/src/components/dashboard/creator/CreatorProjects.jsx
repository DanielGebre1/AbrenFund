import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Link } from "react-router-dom";

const CreatorProjects = () => {
  const projects = [
    {
      id: 1,
      title: "Eco-Friendly Water Filtration System",
      category: "Environment",
      raised: "$15,400",
      goal: "$20,000",
      status: "Active",
      progress: 77,
    },
    {
      id: 2,
      title: "Mobile App for Education in Rural Areas",
      category: "Education",
      raised: "$8,750",
      goal: "$10,000",
      status: "Active",
      progress: 88,
    },
    {
      id: 3,
      title: "AI-Powered Waste Sorting Robot",
      category: "Innovation & Tech",
      raised: "$42,000",
      goal: "$50,000",
      status: "Active",
      progress: 84,
    },
    {
      id: 4,
      title: "Online Learning Platform for Coding",
      category: "Computer Science",
      raised: "$5,200",
      goal: "$15,000",
      status: "Draft",
      progress: 35,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Projects</h2>
        <Button asChild>
          <Link to="/create-campaign">Create New Project</Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64">
          <Input placeholder="Search projects..." className="w-full" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Raised</TableHead>
                <TableHead>Goal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>{project.raised}</TableCell>
                  <TableCell>{project.goal}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      project.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorProjects;
