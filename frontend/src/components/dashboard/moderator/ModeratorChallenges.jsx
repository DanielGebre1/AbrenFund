import { useState } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../ui/dialog";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";

const ModeratorChallenges = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const challenges = [
    {
      id: 1,
      title: "Sustainable Urban Mobility",
      company: "GreenCity Technologies",
      budget: "$50,000",
      deadline: "2023-07-15",
      status: "Active",
      proposals: 12
    },
    {
      id: 2,
      title: "Clean Water Solutions",
      company: "AquaPure Inc.",
      budget: "$75,000",
      deadline: "2023-08-01",
      status: "Active",
      proposals: 8
    },
    {
      id: 3,
      title: "Renewable Energy for Remote Areas",
      company: "EcoSolutions Co.",
      budget: "$100,000",
      deadline: "2023-06-30",
      status: "Active",
      proposals: 15
    },
    {
      id: 4,
      title: "Digital Literacy Tools",
      company: "EduTech Foundation",
      budget: "$40,000",
      deadline: "2023-07-20",
      status: "Draft",
      proposals: 0
    },
    {
      id: 5,
      title: "Healthcare Access Platform",
      company: "MediConnect Systems",
      budget: "$65,000",
      deadline: "2023-08-15",
      status: "Under Review",
      proposals: 0
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Company Challenges</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Challenge</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Challenge</DialogTitle>
              <DialogDescription>
                Set up a new company funding challenge for creators
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="challenge-title">Challenge Title</Label>
                <Input id="challenge-title" placeholder="Enter challenge title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="challenge-company">Company Name</Label>
                <Input id="challenge-company" placeholder="Company name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="challenge-budget">Budget</Label>
                  <Input id="challenge-budget" placeholder="e.g. $50,000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="challenge-deadline">Deadline</Label>
                  <Input id="challenge-deadline" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="challenge-description">Challenge Description</Label>
                <Textarea
                  id="challenge-description"
                  placeholder="Describe the challenge, goals, and requirements"
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="challenge-scope">Project Scope</Label>
                <Textarea
                  id="challenge-scope"
                  placeholder="Define what types of projects can be submitted"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Create Challenge</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64">
          <Input placeholder="Search challenges..." className="w-full" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="review">Under Review</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challenge Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Proposals</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.map((challenge) => (
                <TableRow key={challenge.id}>
                  <TableCell className="font-medium">{challenge.title}</TableCell>
                  <TableCell>{challenge.company}</TableCell>
                  <TableCell>{challenge.budget}</TableCell>
                  <TableCell>{challenge.deadline}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        challenge.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : challenge.status === "Draft"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {challenge.status}
                    </span>
                  </TableCell>
                  <TableCell>{challenge.proposals}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
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
};

export default ModeratorChallenges;
