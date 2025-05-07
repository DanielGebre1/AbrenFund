import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Badge } from "../../ui/badge";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { ArrowUpRight, CheckCircle, XCircle } from "lucide-react";

const ModeratorReviewProjects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const projects = [
    {
      id: 1,
      title: "Urban Garden Initiative",
      creator: "Alex Johnson",
      category: "Environment",
      submitted: "2023-06-15",
      fundingGoal: "$20,000",
      status: "pending"
    },
    {
      id: 2,
      title: "Community Art Space",
      creator: "Sarah Williams",
      category: "Arts",
      submitted: "2023-06-18",
      fundingGoal: "$15,000",
      status: "pending"
    },
    {
      id: 3,
      title: "Renewable Energy Hub",
      creator: "Michael Brown",
      category: "Technology",
      submitted: "2023-06-10",
      fundingGoal: "$50,000",
      status: "pending"
    },
    {
      id: 4,
      title: "Local Food Delivery App",
      creator: "Emily Davis",
      category: "Food",
      submitted: "2023-06-20",
      fundingGoal: "$12,000",
      status: "pending"
    },
    {
      id: 5,
      title: "Youth Coding Workshops",
      creator: "James Wilson",
      category: "Education",
      submitted: "2023-06-05",
      fundingGoal: "$25,000",
      status: "pending"
    }
  ];

  const openReviewDialog = (project) => {
    setSelectedProject(project);
    setReviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Review Projects</h2>
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
        <Select defaultValue="pending">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="changes">Changes Requested</SelectItem>
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
                <TableHead>Submitted</TableHead>
                <TableHead>Funding Goal</TableHead>
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
                  <TableCell>{project.submitted}</TableCell>
                  <TableCell>{project.fundingGoal}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
                      Pending
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openReviewDialog(project)}
                      >
                        Review
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Review Project</DialogTitle>
            <DialogDescription>
              {selectedProject ? selectedProject.title : "Project"} by {selectedProject ? selectedProject.creator : "Creator"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Project Details</TabsTrigger>
              <TabsTrigger value="content">Content Review</TabsTrigger>
              <TabsTrigger value="decision">Decision</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <p className="text-sm font-medium mt-1">
                    {selectedProject ? selectedProject.category : "Category"}
                  </p>
                </div>
                <div>
                  <Label>Funding Goal</Label>
                  <p className="text-sm font-medium mt-1">
                    {selectedProject ? selectedProject.fundingGoal : "$0"}
                  </p>
                </div>
                <div>
                  <Label>Submission Date</Label>
                  <p className="text-sm font-medium mt-1">
                    {selectedProject ? selectedProject.submitted : "Date"}
                  </p>
                </div>
                <div>
                  <Label>Creator Profile</Label>
                  <p className="text-sm font-medium mt-1 text-blue-600 cursor-pointer">
                    View Profile
                  </p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <Label>Project Description</Label>
                <p className="text-sm mt-2">
                  This is where the project description would appear. The content would include the project's goals,
                  objectives, implementation plan, timeline, and other relevant information provided by the creator.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label>Content Requirements</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <p className="text-sm">Clear project description</p>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <p className="text-sm">Appropriate content and language</p>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <p className="text-sm">Realistic funding goals</p>
                    </div>
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-600 mr-2" />
                      <p className="text-sm">Detailed budget breakdown</p>
                    </div>
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-600 mr-2" />
                      <p className="text-sm">Timeline for project completion</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content-notes">Content Review Notes</Label>
                  <Textarea 
                    id="content-notes" 
                    placeholder="Add your notes about the project content..." 
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="decision" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="decision">Review Decision</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select decision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approve">Approve Project</SelectItem>
                      <SelectItem value="reject">Reject Project</SelectItem>
                      <SelectItem value="changes">Request Changes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback to Creator</Label>
                  <Textarea 
                    id="feedback" 
                    placeholder="Provide feedback to the project creator..." 
                    rows={5}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setReviewDialogOpen(false)}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModeratorReviewProjects;