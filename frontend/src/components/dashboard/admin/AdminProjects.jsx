import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { ArrowUpRight, Edit, Trash } from "lucide-react";

function AdminProjects() {
  const projects = [
    {
      id: 1,
      title: "Urban Garden Initiative",
      creator: "Alex Johnson",
      category: "Environment",
      funded: "$12,450",
      goal: "$20,000",
      status: "active"
    },
    {
      id: 2,
      title: "Community Art Space",
      creator: "Sarah Williams",
      category: "Arts",
      funded: "$8,230",
      goal: "$15,000",
      status: "active"
    },
    {
      id: 3,
      title: "Renewable Energy Hub",
      creator: "Michael Brown",
      category: "Technology",
      funded: "$45,670",
      goal: "$50,000",
      status: "completed"
    },
    {
      id: 4,
      title: "Local Food Delivery App",
      creator: "Emily Davis",
      category: "Food",
      funded: "$5,340",
      goal: "$12,000",
      status: "active"
    },
    {
      id: 5,
      title: "Youth Coding Workshops",
      creator: "James Wilson",
      category: "Education",
      funded: "$18,900",
      goal: "$25,000",
      status: "suspended"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects Management</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64">
          <Input placeholder="Search projects..." className="w-full" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="environment">Environment</SelectItem>
            <SelectItem value="arts">Arts</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="food">Food</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Funded</TableHead>
                <TableHead>Goal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="font-medium">{project.title}</div>
                  </TableCell>
                  <TableCell>{project.creator}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>{project.funded}</TableCell>
                  <TableCell>{project.goal}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
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
}

export default AdminProjects;
