import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Badge } from "../../ui/badge";
import { Textarea } from "../../ui/textarea";
import { ArrowUpRight } from "lucide-react";

const ModeratorReviewProposals = () => {
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  
  const proposals = [
    {
      id: 1,
      title: "Sustainable Urban Transport Solution",
      creator: "Alex Johnson",
      challenge: "Green City Initiative",
      company: "EcoSolutions Inc.",
      submitted: "2023-06-15",
      status: "pending"
    },
    {
      id: 2,
      title: "Community Art Workshop Series",
      creator: "Sarah Williams",
      challenge: "Cultural Enrichment Program",
      company: "ArtSpace Foundation",
      submitted: "2023-06-18",
      status: "pending"
    },
    {
      id: 3,
      title: "Solar Panel Installation Project",
      creator: "Michael Brown",
      challenge: "Renewable Energy Challenge",
      company: "CleanPower Corp",
      submitted: "2023-06-10",
      status: "pending"
    },
    {
      id: 4,
      title: "Farm-to-Table Distribution Network",
      creator: "Emily Davis",
      challenge: "Sustainable Food Systems",
      company: "FreshFoods Co-op",
      submitted: "2023-06-20",
      status: "pending"
    },
    {
      id: 5,
      title: "Digital Literacy Program",
      creator: "James Wilson",
      challenge: "Education Access Initiative",
      company: "TechEd Foundation",
      submitted: "2023-06-05",
      status: "pending"
    }
  ];

  const openReviewDialog = (proposal) => {
    setSelectedProposal(proposal);
    setReviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Review Challenge Proposals</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64">
          <Input placeholder="Search proposals..." className="w-full" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Challenge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Challenges</SelectItem>
            <SelectItem value="green">Green City Initiative</SelectItem>
            <SelectItem value="cultural">Cultural Enrichment</SelectItem>
            <SelectItem value="renewable">Renewable Energy</SelectItem>
            <SelectItem value="food">Sustainable Food</SelectItem>
            <SelectItem value="education">Education Access</SelectItem>
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
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proposal</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Challenge</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>
                    <div className="font-medium">{proposal.title}</div>
                  </TableCell>
                  <TableCell>{proposal.creator}</TableCell>
                  <TableCell>{proposal.challenge}</TableCell>
                  <TableCell>{proposal.company}</TableCell>
                  <TableCell>{proposal.submitted}</TableCell>
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
                        onClick={() => openReviewDialog(proposal)}
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
            <DialogTitle>Review Challenge Proposal</DialogTitle>
            <DialogDescription>
              {selectedProposal ? selectedProposal.title : "Proposal"} for {selectedProposal ? selectedProposal.challenge : "Challenge"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Proposal Details</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
              <TabsTrigger value="decision">Decision</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Creator</Label>
                  <p className="text-sm font-medium mt-1">
                    {selectedProposal ? selectedProposal.creator : "Creator"}
                  </p>
                </div>
                <div>
                  <Label>Company</Label>
                  <p className="text-sm font-medium mt-1">
                    {selectedProposal ? selectedProposal.company : "Company"}
                  </p>
                </div>
                <div>
                  <Label>Challenge</Label>
                  <p className="text-sm font-medium mt-1">
                    {selectedProposal ? selectedProposal.challenge : "Challenge"}
                  </p>
                </div>
                <div>
                  <Label>Submission Date</Label>
                  <p className="text-sm font-medium mt-1">
                    {selectedProposal ? selectedProposal.submitted : "Date"}
                  </p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <Label>Proposal Summary</Label>
                <p className="text-sm mt-2">
                  This is where the proposal summary would appear. The content would include the proposed solution,
                  implementation strategy, budget requirements, timeline, and expected outcomes or impact metrics.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <Label>Alignment with Challenge Goals</Label>
                <p className="text-sm mt-2">
                  This section would explain how the proposal aligns with the specific goals and requirements 
                  of the company challenge, including addressing the specific problem statement and meeting 
                  the technical or social criteria outlined in the challenge.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="evaluation" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Innovation Score (1-10)</Label>
                  <Input type="number" min="1" max="10" placeholder="Score" />
                </div>
                
                <div className="space-y-2">
                  <Label>Feasibility Score (1-10)</Label>
                  <Input type="number" min="1" max="10" placeholder="Score" />
                </div>
                
                <div className="space-y-2">
                  <Label>Impact Score (1-10)</Label>
                  <Input type="number" min="1" max="10" placeholder="Score" />
                </div>
                
                <div className="space-y-2">
                  <Label>Budget Appropriateness (1-10)</Label>
                  <Input type="number" min="1" max="10" placeholder="Score" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="evaluation-notes">Evaluation Notes</Label>
                  <Textarea 
                    id="evaluation-notes" 
                    placeholder="Add your evaluation notes..." 
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
                      <SelectItem value="approve">Approve Proposal</SelectItem>
                      <SelectItem value="shortlist">Add to Shortlist</SelectItem>
                      <SelectItem value="reject">Reject Proposal</SelectItem>
                      <SelectItem value="request">Request Additional Information</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea 
                    id="feedback" 
                    placeholder="Provide feedback on the proposal..." 
                    rows={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-recommendation">Recommendation to Company</Label>
                  <Textarea 
                    id="company-recommendation" 
                    placeholder="Add recommendations for the company..." 
                    rows={3}
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

export default ModeratorReviewProposals;