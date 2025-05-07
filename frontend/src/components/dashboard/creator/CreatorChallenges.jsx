import React, { useState } from "react";
import { Eye, ArrowUpDown, CheckCircle, XCircle, Users } from "lucide-react";
import { Textarea } from '../../ui/textarea';
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";

// Mock data for challenges
const challenges = [
  {
    id: 1,
    title: "Sustainable Energy Solution",
    company: "GreenTech Energy",
    category: "Environment",
    submissions: 12,
    reward: "50,000 ETB",
    deadline: "2023-12-15",
    status: "active"
  },
  {
    id: 2,
    title: "Student Accommodation App",
    company: "Wollo University",
    category: "Innovation & Tech",
    submissions: 8,
    reward: "35,000 ETB",
    deadline: "2023-11-30",
    status: "active"
  },
  {
    id: 3,
    title: "Agricultural Waste Management",
    company: "AgroEthiopia",
    category: "Environment",
    submissions: 5,
    reward: "40,000 ETB",
    deadline: "2024-01-10",
    status: "active"
  }
];

// Mock data for submissions
const submissions = [
  {
    id: 1,
    challengeId: 1,
    projectTitle: "Solar-Powered Water Purification",
    creator: "Alex Johnson",
    submitted: "2023-10-15",
    status: "pending"
  },
  {
    id: 2,
    challengeId: 1,
    projectTitle: "Wind Energy Micro-Generators",
    creator: "Sarah Williams",
    submitted: "2023-10-18",
    status: "approved"
  },
  {
    id: 3,
    challengeId: 2,
    projectTitle: "DormFinder App",
    creator: "Michael Brown",
    submitted: "2023-10-12",
    status: "rejected"
  },
  {
    id: 4,
    challengeId: 2,
    projectTitle: "Campus Housing Marketplace",
    creator: "Emily Davis",
    submitted: "2023-10-20",
    status: "pending"
  }
];

const CreatorChallenges = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [viewSubmissionsForChallenge, setViewSubmissionsForChallenge] = useState(null);

  // Filter and sort challenges
  const filteredChallenges = challenges.filter(challenge => {
    return (
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || challenge.status === statusFilter)
    );
  }).sort((a, b) => {
    if (sortColumn === "title") {
      return sortDirection === "asc" 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortColumn === "submissions") {
      return sortDirection === "asc" 
        ? a.submissions - b.submissions
        : b.submissions - a.submissions;
    }
    return 0;
  });

  // Filter submissions for a specific challenge
  const filteredSubmissions = submissions.filter(submission => 
    viewSubmissionsForChallenge ? submission.challengeId === viewSubmissionsForChallenge : true
  );

  // Handler for status change
  const handleStatusChange = (submissionId, newStatus) => {
    toast.success(`Submission ${submissionId} has been ${newStatus}`);
    setSubmissionDialogOpen(false);
    setFeedbackText("");
  };

  // Handle sorting change
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // View submissions for a specific challenge
  const viewSubmissionsFor = (challengeId) => {
    setViewSubmissionsForChallenge(challengeId);
  };

  // Go back to challenges list
  const backToChallenges = () => {
    setViewSubmissionsForChallenge(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Challenges</h2>
          <p className="text-muted-foreground">Manage your company challenges and review submissions</p>
        </div>
        <Button onClick={() => window.location.href = '/create-campaign'}>Create New Challenge</Button>
      </div>

      {viewSubmissionsForChallenge ? (
        <>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={backToChallenges}>
              ← Back to All Challenges
            </Button>
            <h3 className="text-lg font-semibold">
              {challenges.find(c => c.id === viewSubmissionsForChallenge)?.title} - Submissions
            </h3>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Title</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.projectTitle}</TableCell>
                        <TableCell>{submission.creator}</TableCell>
                        <TableCell>{submission.submitted}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              submission.status === "approved" ? "default" : 
                              submission.status === "rejected" ? "destructive" : 
                              "outline"
                            }
                          >
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setSubmissionDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No submissions found for this challenge
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-64">
              <Input 
                placeholder="Search challenges..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select 
              defaultValue="all" 
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center">
                        Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("submissions")}
                    >
                      <div className="flex items-center">
                        Submissions
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Reward</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChallenges.length > 0 ? (
                    filteredChallenges.map((challenge) => (
                      <TableRow key={challenge.id}>
                        <TableCell className="font-medium">{challenge.title}</TableCell>
                        <TableCell>{challenge.company}</TableCell>
                        <TableCell>{challenge.category}</TableCell>
                        <TableCell>{challenge.submissions}</TableCell>
                        <TableCell>{challenge.reward}</TableCell>
                        <TableCell>{challenge.deadline}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={challenge.status === "active" ? "outline" : "secondary"}
                          >
                            {challenge.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => viewSubmissionsFor(challenge.id)}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            View Submissions
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No challenges found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Submission Details Dialog */}
      <Dialog open={submissionDialogOpen} onOpenChange={setSubmissionDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Review this project submission for your challenge
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm">Project Title</h3>
                  <p>{selectedSubmission.projectTitle}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Submitted By</h3>
                  <p>{selectedSubmission.creator}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Submission Date</h3>
                <p>{selectedSubmission.submitted}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Project Description</h3>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ultricies, 
                  felis at aliquam dapibus, est elit finibus urna, vitae fermentum orci dolor non lectus.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Solution Approach</h3>
                <p className="text-muted-foreground">
                  Donec facilisis augue eu ligula varius, ut dignissim magna iaculis. 
                  Etiam imperdiet tincidunt ultrices. Morbi non sollicitudin odio, quis eleifend libero.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Budget & Timeline</h3>
                <p className="text-muted-foreground">
                  Anticipated completion within 3 months with a detailed budget breakdown 
                  for personnel, equipment, and operational costs.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm">Your Feedback</h3>
                <Textarea 
                  placeholder="Provide feedback on this submission..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button 
              variant="destructive"
              onClick={() => handleStatusChange(selectedSubmission?.id, "rejected")}
              className="w-full sm:w-auto"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Submission
            </Button>
            <Button 
              onClick={() => handleStatusChange(selectedSubmission?.id, "approved")}
              className="w-full sm:w-auto"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve & Fund Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatorChallenges;